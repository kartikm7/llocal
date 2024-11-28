import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { Document } from '@langchain/core/documents'
import { dialog } from 'electron/main'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { FaissStore } from '@langchain/community/vectorstores/faiss'
import { readdirSync, rm } from 'fs'
import path from 'path'
import { documentsDirectory } from '..'
// import { AutoModel } from '@huggingface/transformers'

interface GetFile {
  canceled: boolean
  filePaths: string[]
}

interface AddKnowledgeType {
  path: string
  fileName: string
}

interface RagReturn {
  prompt: string
  sources: string
}

interface ScoredDocument extends Document {
  score: number;
}

export const getFileName = (dir: string): string => path.basename(dir)


export async function getSelectedFiles(): Promise<GetFile> {
  return new Promise((resolve, reject) => {
    dialog
      .showOpenDialog({
        message: 'Choose files to add to the knowledge base',
        filters: [
          { name: 'pdf, pptx, docx, txt, csv', extensions: ['pdf', 'pptx', 'docx', 'txt', 'csv'] }
        ]
      })
      .then((filePath): void => {
        if (filePath.canceled) reject(`The operation has been aborted!`)
        resolve(filePath)
      })
  })
}


// Not yet needed
// export function checkIfDuplicate(fileName: string):boolean{
//   const exisiting =  getVectorDbList(); // this brings all the available documents
//   for(let i = 0 ; i < exisiting.length; i++){
//     if(exisiting[i] == fileName) return false // incase there's already an exisiting index folder we need to do something about it
//   }
//   return true; // otherwise, voila!
// }

export const saveVectorDb = async (docs: Document[], saveDirectory: string): Promise<boolean> => {
  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://127.0.0.1:11434',
    model: 'all-minilm'
  })

  const textSplitter = new RecursiveCharacterTextSplitter()

  try {
    const splits = await textSplitter.splitDocuments(docs)
    const vectorstore = await FaissStore.fromDocuments(splits, embeddings)
    await vectorstore.save(saveDirectory)
    return true
  } catch (error) {
    console.error('Error saving vector database:', error)
    return false
  }
}

export const getVectorDbList = (): AddKnowledgeType[] => {
  const dbDirectory = path.join(documentsDirectory, 'LLocal', 'Knowledge Base')
  return readdirSync(dbDirectory, { withFileTypes: true })
    .filter((dirEntry) => dirEntry.isDirectory())
    .map((dirEntry) => ({
      path: path.join(dbDirectory, dirEntry.name),
      fileName: dirEntry.name
    }))
}

const generateSources = (similaritySearchResults: Document[]): string => {
  let sources = '\n Sources: \n'
  sources += '| Database | Location |\n |------|------| \n'
  similaritySearchResults.forEach(val => {
    const splits = val.metadata.dbName.split(".")
    const fileType = splits[splits.length - 1]
    if (fileType === 'pdf') {
      const dbName = val.metadata.dbName || 'Unknown'
      sources += `| ${dbName} | Page: ${val.metadata.loc.pageNumber} (${val.metadata.loc.lines.from} to ${val.metadata.loc.lines.to}) | \n`
    } else if (fileType === 'csv') {
      const dbName = val.metadata.dbName || 'Unknown'
      sources += `| ${dbName} | Line: ${val.metadata.line} | \n`
    } else {
      const dbName = val.metadata.dbName || 'Unknown'
      sources += `| ${dbName} | Line: ${val.metadata.loc.lines.from} to ${val.metadata.loc.lines.to} | \n`
    }
  })
  return sources
}
// Optimized reranking function
export const bm25Rerank = (results: Document[], query: string, k1 = 1.5, b = 0.75): ScoredDocument[] => {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
  const docCount = results.length;
  const avgDocLength = results.reduce((sum, r) => sum + r.pageContent.length, 0) / docCount;

  // Pre-compute IDF scores
  const idfScores = new Map<string, number>();
  queryTerms.forEach(term => {
    const docsWithTerm = results.filter(r => r.pageContent.toLowerCase().includes(term)).length;
    const idf = Math.log((docCount - docsWithTerm + 0.5) / (docsWithTerm + 0.5));
    idfScores.set(term, idf);
  });

  // Create a regular expression for efficient term matching
  const queryRegex = new RegExp(queryTerms.join('|'), 'gi');

  const scoredResults: ScoredDocument[] = results.map(result => {
    const content = result.pageContent.toLowerCase();
    const termFrequencies = new Map<string, number>();

    // Count term frequencies
    let match;
    while ((match = queryRegex.exec(content)) !== null) {
      const term = match[0].toLowerCase();
      termFrequencies.set(term, (termFrequencies.get(term) || 0) + 1);
    }

    // Calculate BM25 score
    let score = 0;
    queryTerms.forEach(term => {
      const tf = termFrequencies.get(term) || 0;
      const idf = idfScores.get(term) || 0;
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (content.length / avgDocLength));
      score += idf * (numerator / denominator);
    });
    return { ...result, score };
  });

  // Sort by score in descending order
  return scoredResults.sort((a, b) => b.score - a.score);
};

export const similaritySearch = async (
  selectedKnowledge: AddKnowledgeType[],
  prompt: string,
): Promise<RagReturn> => {
  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://127.0.0.1:11434',
    model: 'all-minilm'
  })
  const allResults = await Promise.all(selectedKnowledge.map(async (db) => {
    const vectorstore = await FaissStore.load(db.path, embeddings)
    const results = await vectorstore.similaritySearch(prompt)
    return results.map(result => ({
      ...result,
      metadata: { ...result.metadata, dbName: db.fileName }
    }))
  })).then(results => results.flat())
  // Use the optimized BM25 reranking
  const rerankedResults = bm25Rerank(allResults, prompt)
  const sources = generateSources(rerankedResults)

  return {
    prompt: `QUESTION:  ${prompt},\n
    Answer the question as accurate as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer: \n
    CONTEXT : ${JSON.stringify(rerankedResults)}`,
    sources
  }
}

// export const searchAllVectorDbs = async (prompt: string): Promise<RagReturn> => {
//   return similaritySearch('', 'pdf', prompt, true)
// }

export function deleteVectorDb(indexPath: string): boolean {
  /* This is so interesting, because we don't need to use a try catch here,
  since where we make a call we can use the try catch there this nuance makes javascript so interesting */
  rm(indexPath, { recursive: true, force: true }, (err) => {
    if (err) {
      throw err
    }
  })
  return true
}

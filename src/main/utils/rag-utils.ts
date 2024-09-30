import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { Document } from '@langchain/core/documents'
import { dialog } from 'electron'
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

export const getSelectedFiles = (): Promise<GetFile> => {
  return dialog.showOpenDialog({
    message: 'Choose files to add to the knowledge base',
    filters: [
      { name: 'pdf, pptx, docx, txt, csv', extensions: ['pdf', 'pptx', 'docx', 'txt', 'csv'] }
    ]
  })
}

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
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => ({
      path: path.join(dbDirectory, dirent.name),
      fileName: dirent.name
    }))
}

const generateSources = (similaritySearch: any[], fileType: string): string => {
  let sources = '\n Sources: \n'
  
  if (fileType === 'pdf') {
    sources += '| Database | Page Number | From Line |\n |-------|-------|-------| \n'
    similaritySearch.forEach((val) => {
      const dbName = val.metadata.dbName || 'Unknown'
      sources += `| ${dbName} | ${val.metadata.loc.pageNumber} | ${val.metadata.loc.lines.from} to ${val.metadata.loc.lines.to} | \n`
    })
  } else if (fileType === 'csv') {
    sources += '| Database | Line Number |\n|-------|:-------:|\n'
    similaritySearch.forEach((val) => {
      const dbName = val.metadata.dbName || 'Unknown'
      sources += `| ${dbName} | ${val.metadata.line} | \n`
    })
  } else {
    sources += '| Database | From Line |\n |-------|-------| \n'
    similaritySearch.forEach((val) => {
      const dbName = val.metadata.dbName || 'Unknown'
      sources += `| ${dbName} | ${val.metadata.loc.lines.from} to ${val.metadata.loc.lines.to} | \n`
    })
  }

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
  path: string,
  fileType: string,
  prompt: string,
  searchAllDbs: boolean = true
): Promise<RagReturn> => {
  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://127.0.0.1:11434',
    model: 'all-minilm'
  })

  let allResults: Document[];

  if (searchAllDbs) {
    const vectorDbList = getVectorDbList()
    allResults = await Promise.all(vectorDbList.map(async (db) => {
      const vectorstore = await FaissStore.load(db.path, embeddings)
      const results = await vectorstore.similaritySearch(prompt)
      return results.map(result => ({
        ...result,
        metadata: { ...result.metadata, dbName: db.fileName }
      }))
    })).then(results => results.flat())
  } else {
    const vectorstore = await FaissStore.load(path, embeddings)
    allResults = await vectorstore.similaritySearch(prompt)
    allResults = allResults.map(result => ({
      ...result,
      metadata: { ...result.metadata, dbName: getFileName(path) }
    }))
  }

  // Use the optimized BM25 reranking
  const rerankedResults = bm25Rerank(allResults, prompt)

  const sources = generateSources(rerankedResults, fileType)

  return {
    prompt: `QUESTION:  ${prompt},\n
    Answer the question as accurate as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer: \n 
    CONTEXT : ${JSON.stringify(rerankedResults)}`,
    sources
  }
}

export const searchAllVectorDbs = async (prompt: string): Promise<RagReturn> => {
  return similaritySearch('', 'pdf', prompt, true)
}

export const deleteVectorDb = (indexPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    rm(indexPath, { recursive: true, force: true }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
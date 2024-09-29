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

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  })

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

// Replace rerankResults with bm25Rerank function
export const bm25Rerank = (results: any[], query: string, k1 = 1.5, b = 0.75): any[] => {
  const queryTerms = query.toLowerCase().split(' ');
  const avgDocLength = results.reduce((sum, r) => sum + r.pageContent.length, 0) / results.length;
  
  return results.map(result => {
    const content = result.pageContent.toLowerCase();
    let score = 0;
    
    queryTerms.forEach(term => {
      const tf = (content.match(new RegExp(term, 'g')) || []).length;
      const idf = Math.log((results.length - results.filter(r => r.pageContent.toLowerCase().includes(term)).length + 0.5) / 
                           (results.filter(r => r.pageContent.toLowerCase().includes(term)).length + 0.5));
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (content.length / avgDocLength));
      score += idf * (numerator / denominator);
    });
    
    return { ...result, score };
  }).sort((a, b) => b.score - a.score);
}

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

  let allResults: any[];

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

  // Use BM25 reranking instead of cross-encoder reranking
  const rerankedResults = bm25Rerank(allResults, prompt)

  const sources = generateSources(rerankedResults, fileType)

  return {
    prompt: `This is my question ${prompt},\n answer only from the following context: \n ${JSON.stringify(rerankedResults)}`,
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
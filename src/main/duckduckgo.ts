import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

interface duckduckgoSearchType {
  prompt: string
  sources: string
}

export async function duckduckgoSearch(searchQuery: string): Promise<duckduckgoSearchType> {
  // initiating  the search
  const tool = new DuckDuckGoSearch({ maxResults: 10 })

  const searchResults = await tool.invoke(searchQuery)

  // Parsing the string to JSON
  const results = JSON.parse(searchResults)

  // Formatting the docs correctly for
  const docs = results.map((val) => {
    return {
      pageContent: JSON.stringify({ title: val.title, snippet: val.snippet }),
      metadata: { source: val.link }
    }
  })

  // splitting it into relevant chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50
  })
  const allSplits = await textSplitter.splitDocuments(docs)

  // generating embeddings for the same
  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://127.0.0.1:11434',
    model: 'all-minilm'
  })
  const vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings)

  const similaritySearch = await vectorStore.similaritySearch(searchQuery)

  // for typescript, not too sure if this is optimal but I guess it works
  let sources: string
  sources = '\n'

  // sending the citations aswell
  for (let i = 0; i < similaritySearch.length; i++) {
    sources = sources + `[Source ${i + 1}](${similaritySearch[i].metadata.source}) ${i != similaritySearch.length - 1 ? ', ' : '' }`
  }
  return {
    prompt: `The question asked is ${searchQuery} \n 
    and you must respond to the question based only one the following context and make sure to correctly parse the html: ${JSON.stringify(similaritySearch)}`,
    sources: sources
  }
}

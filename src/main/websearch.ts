// import { DuckDuckGoSearch } from '@langchain/community/tools/duckduckgo_search'
// import DDG from "duck-duck-scrape"
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import {
  search,
  OrganicResult, // Import the result types you need
} from "google-sr";


export interface webSearchType {
  prompt: string
  sources: string
}

export async function webSearch(searchQuery: string): Promise<webSearchType> {

  // depcrecated this, since there are issues with the headers causing the search to break
  // initiating  the search
  // const searchResults = await DDG.search(searchQuery, {
  //   safeSearch: DDG.SafeSearchType.STRICT
  // });
  //
  // const results = searchResults.results

  const results = await search({
    query: searchQuery,
    // Specify the result types explicitly ([OrganicResult] is the default, but it is recommended to always specify the result type)
    resultTypes: [OrganicResult],
    // Optional: Customize the request using AxiosRequestConfig (e.g., enabling safe search)
    requestConfig: {
      params: {
        safe: "active",   // Enable "safe mode"
      },
    },
  });



  // Formatting the docs correctly for
  const docs = results.map((val) => {
    return {
      pageContent: JSON.stringify({ title: val.title, snippet: val.description }),
      metadata: { source: val.link, title: val.title }
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
  console.log(similaritySearch)

  // for typescript, not too sure if this is optimal but I guess it works
  let sources: string
  sources = '\n'

  // sending the citations aswell
  for (let i = 0; i < similaritySearch.length; i++) {
    sources = sources + `[${similaritySearch[i].metadata.title}](${similaritySearch[i].metadata.source}) ${i != similaritySearch.length - 1 ? ' ' : ''}`
  }
  return {
    prompt: `The question asked is ${searchQuery} \n
    and you must respond to the question based only one the following context and make sure to correctly parse the html: ${JSON.stringify(similaritySearch)}`,
    sources: sources
  }
}

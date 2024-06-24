import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { load } from 'cheerio'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer'
// import natural from "natural";
// import { removeStopwords } from "stopword";

interface puppeteerSearchType {
  prompt: string
  sources: string
}

export async function puppeteerSearch(
  searchQuery: string,
  links: string[]
): Promise<puppeteerSearchType> {
  // const tokenizer = new natural.WordTokenizer();
  // const stemmer = natural.PorterStemmer;
  const url = links[0]
  for (let i = 0; i < links.length; i++) {
    searchQuery = searchQuery.replace(links[i], '')
  }

  // data cleaning the scraped data
  const preprocessText = (text: string): string => {
    return text.replace(/\s+/g, ' ').trim()

    // // Tokenize text
    // let tokens = tokenizer.tokenize(text.toLowerCase());

    // // Remove stopwords
    // tokens = removeStopwords(tokens);

    // // Perform stemming
    // tokens = tokens.map((token) => stemmer.stem(token));

    // // Join tokens back into a single string
    // return tokens.join(" ");
  }

  // Function to scrape and clean content
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: { headless: true },
    gotoOptions: { waitUntil: 'domcontentloaded' },
    async evaluate(page, browser): Promise<string> {
      const html = await page.content()
      const $ = load(html)

      // Extract and clean text from relevant tags
      const textElements = $('div, p, span, li, a')
        .map((i, el) => preprocessText($(el).text()))
        .get()
        .join(' ')

      await browser.close()
      return textElements
    }
  })

  // Scrape content from the given URL
  const docs = await loader.load()

  // splitting it into relevant chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50
  })

  const allSplits = await textSplitter.splitDocuments(docs)

  // generating embeddings for the same
  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://127.0.0.1:11434',
    model: 'all-minilm'
  })

  const vectorStore = await MemoryVectorStore.fromDocuments(allSplits, embeddings)

  const searchResults = await vectorStore.similaritySearch(searchQuery)

  return {
    prompt: `this is my question : ${searchQuery} \n answer from the context below: \n ${JSON.stringify(searchResults)}`,
    sources: `\n[Source](${url})`
  }
}

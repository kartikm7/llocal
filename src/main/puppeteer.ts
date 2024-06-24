import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { load } from "cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import natural from "natural";
import { removeStopwords } from "stopword";


interface puppeteerSearchType {
  prompt: string
  link: string
}

export async function puppeteerSearch(searchQuery: string): Promise<puppeteerSearchType> {
    // const tokenizer = new natural.WordTokenizer();
    // const stemmer = natural.PorterStemmer;

    const preprocessText = (text: string): string => {
        return text.replace(/\s+/g, " ").trim();

    // // Tokenize text
    // let tokens = tokenizer.tokenize(text.toLowerCase());

    // // Remove stopwords
    // tokens = removeStopwords(tokens);

    // // Perform stemming
    // tokens = tokens.map((token) => stemmer.stem(token));

    // // Join tokens back into a single string
    // return tokens.join(" ");

    };

    // Function to scrape and clean content
    const scrapeContent = async (url: string): Promise<string> => {
        const loader = new PuppeteerWebBaseLoader(url, {
            launchOptions: { headless: true },
            gotoOptions: { waitUntil: "domcontentloaded" },
            async evaluate(page, browser) {
                const html = await page.content();
                const $ = load(html);

                // Extract and clean text from relevant tags
                const textElements = $("div, p, span, li, a")
                .map((i, el) => preprocessText($(el).text()))
                .get()
                .join(" ");

                await browser.close();
                return textElements;
            },
        });

        return loader.load();
    };

    // Scrape content from the given URL
    const url = "https://en.wikipedia.org/wiki/Sekiro:_Shadows_Die_Twice"
    const docs = await scrapeContent(
    url
    );
    // console.log(docs);

    // initializing ollama model
    const ollama = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "qwen2:1.5b", // Default value
    });

    // splitting it into relevant chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
    });

    const allSplits = await textSplitter.splitDocuments(docs);
    // console.log(allSplits);

    // generating embeddings for the same
    const embeddings = new OllamaEmbeddings({
    baseUrl: "http://127.0.0.1:11434",
    model: "all-minilm",
    });
    
    const vectorStore = await MemoryVectorStore.fromDocuments(
    allSplits,
    embeddings
    );

    // prompt template
    const prompt = PromptTemplate.fromTemplate(
    "this is my question : {question} answer from the context below: \n{context}"
    );

    // defining the chain
    const chain = await createStuffDocumentsChain({
    llm: ollama,
    outputParser: new StringOutputParser(),
    prompt,
    });

    const question = "Explain the 3 types of ending in sekiro";
    const searchResults = await vectorStore.similaritySearch(
    question
    );

    // console.log("Search Results: ", searchResults);


    return {
        prompt: `The question asked is ${question} \n 
        and you must respond to the question based only one the following context : ${JSON.stringify(searchResults)}`,
        link: url
    }

    // console.log(
    // await chain.invoke({
    //     question: question,
    //     context: searchResults,
    // })
    // );

}
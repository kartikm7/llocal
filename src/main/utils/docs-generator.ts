import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from '@langchain/core/documents'

export async function pdfDocs(path:string):Promise<Document[]>{
  const loader = new PDFLoader(path);
  const docs = await loader.load();
  return docs
}

export async function docxDocs(path:string):Promise<Document[]>{
  const loader = new DocxLoader(path);
  const docs = await loader.load();
  return docs
}

export async function pptxDocs(path:string):Promise<Document[]>{
  const loader = new PPTXLoader(path);
  const docs = await loader.load();
  return docs
}

export async function txtDocs(path:string):Promise<Document[]>{
  const loader = new TextLoader(path);
  const docs = await loader.load();
  return docs
}

export async function csvDocs(path:string):Promise<Document[]>{
  const loader = new CSVLoader(path);
  const docs = await loader.load();
  return docs
}

export async function generateDocs(path:string):Promise<Document[]>{
  const splits = path.split('.')
  const fileExtension = splits[splits.length-1]
  let docs:Document[];
  switch (fileExtension) {
    case "pdf":
      docs = await pdfDocs(path)
      return docs;
    case "docx":
      docs = await docxDocs(path)
      return docs;
    case "pptx":
      docs = await pptxDocs(path)
      return docs;
    case "txt":
      docs = await txtDocs(path)
      return docs;
    case "csv":
      docs = await csvDocs(path)
      return docs;
    default:
      break;
  }
  return [] // this should never trigger, I think
}
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from '@langchain/core/documents'

export async function pdfDocs(path:string):Promise<Document[]>{
  const loader = new PDFLoader(path);
  const docs = await loader.load();
  return docs
}
import { ollama } from "@renderer/utils/ollama"
import { StatusResponse } from "ollama"

export interface listModels {
  modelName: string
  modelParameters: string
}

interface useOllamaReturn {
  listModels: ()=>Promise<listModels[]>
  deleteModel: (modelName: string)=>Promise<StatusResponse>
}

export const useOllama = ():useOllamaReturn => {
  const listModels = async ():Promise<listModels[]> => {
    const list = await ollama.list()
    const response:listModels[] = []
    console.log(list);
    
    list.models.forEach((val)=> {response.push({modelName: val.name, modelParameters: val.details.parameter_size})})  
    return response
  }

  const deleteModel = async (modelName: string):Promise<StatusResponse> => {
    const response = await ollama.delete({model: modelName})
    return response
  }
  return {listModels , deleteModel}
  }

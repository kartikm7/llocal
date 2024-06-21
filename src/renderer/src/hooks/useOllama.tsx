import { ollama } from "@renderer/utils/ollama"
import { StatusResponse } from "ollama"
import { useLocal } from "./useLocal"
import { useState } from "react"
import { toast } from "sonner"
import { CustomToast } from "@renderer/ui/CustomToast"

export interface listModels {
  modelName: string
  modelParameters: string
}

interface useOllamaReturn {
  listModels: ()=>Promise<listModels[]>
  deleteModel: (modelName: string)=>Promise<StatusResponse>
  pullModel: (modelName: string | undefined)=>Promise<void>
}

export const useOllama = ():useOllamaReturn => {
  // Initializing states for pulling a model
  const [, setPercentage] = useState(0)
  const { setModelChoice } = useLocal()


  const listModels = async ():Promise<listModels[]> => {
    const list = await ollama.list()
    const response:listModels[] = []
    console.log(list);
    
    list.models.forEach((val)=> {response.push({modelName: val.name, modelParameters: val.details.parameter_size})})  
    // for updating the local storage
    localStorage.setItem('modelList', JSON.stringify(response))
    return response
  }

  const deleteModel = async (modelName: string):Promise<StatusResponse> => {
    const response = await ollama.delete({model: modelName})
    return response
  }

  const pullModel = async (modelName: string | undefined):Promise<void> =>{
    let toastId: string | number | undefined = undefined
    
    try {
      let currentDigestDone = false
      // Setting the toast Id
      toastId = toast.loading(
        <div className="w-full">
          <CustomToast>
            {`Do not leave the settings page until 100% has been reached. The ${modelName} is about to be pulled!`}
          </CustomToast>
        </div>
      )
      const response = await ollama.pull({ model: `${modelName}`, stream: true })
      // reading the streamed response
      for await (const part of response) {
        if (part.digest) {
          let percent = 0
          if (part.completed && part.total) {
            percent = Math.round((part.completed / part.total) * 100)
            setPercentage((preValue) => {
              // Updating the toast value on when the preValue is not equal to the percent
              // Same thought process behind the state I mean it's inside a state updation function
              if (preValue != percent) {
                toast.loading(
                  <CustomToast progressValue={percent}>
                    {`${percent}% has been pulled!`}
                  </CustomToast>,
                  {
                    style: {
                      display: 'block',
                    },
                    id: toastId
                  }
                )
                return percent
              }
              return preValue
            })
          }
          if (percent === 100 && !currentDigestDone) {
            // Once, done updating the toast message and color
            toast.loading(
                <CustomToast className="!text-yellow-600">
                  {`${percent}% has been pulled! Just performing some extra checks.`}
                </CustomToast>,
              { id: toastId }
            )
            currentDigestDone = true
          }
        }
      }
      setModelChoice(`${modelName}`)
      // Dismissing the toast
      toast.dismiss(toastId)
      
      // Success message
      // in the case it's the embedding model
      if(modelName?.includes('mxbai-embed-large') || modelName?.includes('all-minilm')){
        toast.success(`${modelName} has been pulled! You can now make use of web-search!`)
      } else { 
        // in all other cases
        toast.success(`${modelName} is set as the default model!`)
      }
    } catch (error) {
      // Either way need to dismiss the toast
      // The block styling causes an issue with the native styling
      toast.dismiss(toastId)
      // so we launch a new toast
      toast.error(`${error}`)
    }
  }

  return {listModels , deleteModel, pullModel}
  }

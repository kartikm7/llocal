import { helperOllama } from "@renderer/utils/ollama"
import { StatusResponse } from "ollama"
import { useLocal } from "./useLocal"
import { toast } from "sonner"
import { CustomToast } from "@renderer/ui/CustomToast"
import { Button } from "@renderer/ui/Button"
import { t } from "@renderer/utils/utils"

export interface listModels {
  modelName: string
  modelParameters: string
}

interface useOllamaReturn {
  listModels: () => Promise<listModels[]>
  deleteModel: (modelName: string) => Promise<StatusResponse>
  pullModel: (modelName: string | undefined) => Promise<void>
}

export const useOllama = (): useOllamaReturn => {
  // Initializing states for pulling a model
  const { setModelChoice, setList } = useLocal()

  const listModels = async (): Promise<listModels[]> => {
    const list = await helperOllama.list()
    const response: listModels[] = []
    list.models.forEach((val) => { response.push({ modelName: val.name, modelParameters: val.details.parameter_size }) })
    // for updating the local storage
    return response
  }

  const deleteModel = async (modelName: string): Promise<StatusResponse> => {
    const response = await helperOllama.delete({ model: modelName })
    return response
  }

  const pullModel = async (modelName: string | undefined): Promise<void> => {
    let toastId: string | number | undefined = undefined

    let abort = false
    try {
      let currentDigestDone = false
      // Setting the toast Id
      toastId = toast.loading(
        <div className="w-full">
          <CustomToast>
            {`${modelName} is about to be pulled. Feel free to close the settings page!`}
          </CustomToast>
        </div>
      )
      const response = await helperOllama.pull({ model: `${modelName}`, stream: true })
      // this helps update it within the if condition for the first time
      let preValue: number | undefined
      // reading the streamed response
      for await (const part of response) {
        if (part.digest) {
          let percent = 0
          if (part.completed && part.total) {
            percent = Math.round((part.completed / part.total) * 100)
            // Updating the toast value on when the preValue is not equal to the percent
            // Same thought process behind the state I mean it's inside a state updation function
            if (preValue != percent) {
              preValue = percent
              toast.loading(
                <div className="w-full flex">
                  <CustomToast className="w-5/6" progressValue={percent}>
                    {`${percent}% has been pulled!`}
                  </CustomToast>
                  <Button
                    className="text-red-400"
                    onClick={() => {
                      abort = true
                      // This is just to close the async generator
                      helperOllama.abort()
                    }} >Cancel</Button>
                </div >,
                {
                  style: {
                    // display: 'block',
                  },
                  id: toastId
                }
              )
            }
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
      if (abort) throw new Error("Model pull has been aborted")
      // setting model preference
      setModelChoice(`${modelName}`)
      // updating model list state
      const list = await listModels()
      setList(list)

      // Dismissing the toast
      toast.dismiss(toastId)

      // Success message
      // in the case it's the embedding model
      if (modelName?.includes('mxbai-embed-large') || modelName?.includes('all-minilm')) {
        toast.success(t('modelPulled', { modelName }))
      } else {
        // in all other cases
        toast.success(t("modelSetDefault", { modelName }))
      }
    } catch (error) {
      // Either way need to dismiss the toast
      // The block styling causes an issue with the native styling
      toast.dismiss(toastId)

      // so we launch a new toast
      if (abort) toast.info(t('modelPullCancelled', { modelName }))
      else toast.error(`${error}`)
    }
  }

  return { listModels, deleteModel, pullModel }
}

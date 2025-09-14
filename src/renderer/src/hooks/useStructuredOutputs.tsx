import { prefModelAtom } from "@renderer/store/mocks"
import { ollama } from "@renderer/utils/ollama"
import { useAtom } from "jotai"
import { zodToJsonSchema } from 'zod-to-json-schema';

export function useStructureOutputs() {
  const [modelName] = useAtom(prefModelAtom)

  async function getStructuredResponse(prompt, schema, systemPrompt = "") {
    const generation = await ollama.generate({ model: modelName, system: systemPrompt, prompt, stream: false, format: zodToJsonSchema(schema) })
    let result = null
    try {
      result = schema.parse(JSON.parse(generation.response))
    } catch (e) {
    }
    return result
  }
  return { getStructuredResponse }
}

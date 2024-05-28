import axios from 'axios'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'

type binary = {
  name: string
  url: string
}

const binaries = {
  win32: {
    name: 'OllamaSetup.exe',
    url: 'https://github.com/ollama/ollama/releases/download/v0.1.38/OllamaSetup.exe'
  },
  darwin: {
    name: 'ollama-darwin',
    url: 'https://github.com/ollama/ollama/releases/download/v0.1.38/ollama-darwin'
  },
  linux: {
    name: 'ollama-linux',
    url: 'https://github.com/ollama/ollama/releases/download/v0.1.38/ollama-linux-arm64'
  }
}

export function checkOllama(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('ollama serve', (error) => {
      // if check is true, that means there's an error
      const ollamaAlreadyRunning = error?.message.includes(`listen tcp`)
      const ollamaNotInstalled =
        error?.message.includes(`not found`) ||
        error?.message.includes(`not recognized`) ||
        error?.message.includes(`not internal`) ||
        error?.message.includes(`not an internal`)

      // incase not installed then, resolve false, so we can again download
      if (ollamaNotInstalled) {
        resolve(false)
        // incase its already running then it's fine
      } else if (ollamaAlreadyRunning) {
        resolve(true)
        // in the case the ollama serve works then great!
      } else {
        resolve(true)
      }
    })
  })
}

export function binaryPath(binary: string): string[] {
  const val: binary = binaries[binary]
  const directory = path.join(os.homedir(), 'AppData', 'Local', 'LLocal', 'binaries')
  const binaryDirectory = path.resolve(directory, val.name)
  return [binaryDirectory, binaryDirectory.replace(/\s/g, '^ ')]
}

export async function downloadBinaries(): Promise<string> {
  const operatingSystem = os.platform()

  // This is for returning if the platform is not supported
  const binary: binary = binaries[operatingSystem]
  if (!binary) return 'Not availble for this platform'

  const directory = path.join(os.homedir(), 'AppData', 'Local', 'LLocal', 'binaries')
  const binaryDirectory = path.join(directory, binary.name)
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })

  // This is for returning if it already exists (Not optimal)
  if (fs.existsSync(binaryDirectory)) return 'exists'
  const filePath = path.resolve(directory, binary.name)

  try {
    const writer = fs.createWriteStream(filePath)
    const response = await axios.get(binary.url, { responseType: 'stream' })
    await new Promise<void>((resolve, reject) => {
      response.data.pipe(writer)
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
    return 'success'
  } catch (error) {
    return 'error'
  }
}

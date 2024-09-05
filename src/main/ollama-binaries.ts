import axios from 'axios'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { downloadDirectory } from '.'

type binary = {
  name: string
}

export const binaryNames = {
  win32: {
    name: 'OllamaSetup.exe',
  },
  darwin: {
    name: 'Ollama-darwin.zip',
  },
  linux: {
    name: 'ollama-linux',
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

// check os and resolve directory, this makes llocal os agnostic hopefully
function dir(): string {
  const operatingSystem = os.platform()
  switch (operatingSystem) {
    case 'darwin':
      return path.join(downloadDirectory, 'LLocal', 'binaries')
    case 'win32':
      return path.join(os.homedir(), 'AppData', 'Roaming', 'LLocal', 'binaries')
    default:
      return path.join(downloadDirectory, 'LLocal', 'Binaries')
  }
}

export function binaryPath(binary: string): string[] {
  const val: binary = binaryNames[binary]
  // const directory = path.join(os.homedir(), 'AppData', 'Local', 'LLocal', 'binaries')

  // this ensures the directory is correct
  const directory = dir()
  const binaryDirectory = path.resolve(directory, val.name)
  return [binaryDirectory, binaryDirectory.replace(/\s/g, '^ ')]
}

export async function downloadBinaries(): Promise<string> {
  const operatingSystem = os.platform()

  // This is for returning if the platform is not supported
  const binary: binary = binaryNames[operatingSystem]
  if (!binary) return 'Not availble for this platform'

  // holds the download link for the asset
  const binaryUrl = await getAssetUrl(binary.name)
  
  const directory = dir()
  // Handling the edge cases for mac and (hopefully) linux
  // mac requires the extension (I think)
  const binaryDirectory = path.join(directory, binary.name)

  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })

  // This is for returning if it already exists (Not optimal)
  if (fs.existsSync(binaryDirectory)) {
    const fileSize = fs.statSync(binaryDirectory).size
    // incase the downloaded file is the not same size as the actual size of the current installer we can delete/remove it
    // and perform a fresh install
    if(await checkSize(binary.name,fileSize)) return 'exists' 
  }

  // mack surely requires .zip extension here otherwise, doesn't download the file correctly
  const filePath = path.resolve(directory, binary.name)

  // downloading by writing to the resolved path
  try {
    const writer = fs.createWriteStream(filePath)
    const response = await axios.get(binaryUrl, { responseType: 'stream' })
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

export async function installOllamaLinux(): Promise<string> {
  return new Promise((resolve, reject)=> {
    exec('gnome-terminal -- bash -c "curl -fsSL https://ollama.com/install.sh | sh; exec bash"', (error) => {
      if(error == null){
        resolve('linux-detected') // edge case handled on the frontend
      } else{
        reject('download-failed')
      }
    })
  }) 
}


async function getLatestRelease():Promise<GitHubLatestRelease>{
  const response = await fetch('https://api.github.com/repos/ollama/ollama/releases/latest')
  return await response.json()
}
/* Just wanted to implement a singleton class man xD, but it does optimize the code quite a bit
   well atleast for the current session */
class GetLatestRelease {
  cache;
  static latest: GetLatestRelease;
  constructor(){
    if(GetLatestRelease.latest) return GetLatestRelease.latest
    GetLatestRelease.latest = this
  }
  async get():Promise<GitHubLatestRelease>{
    if(!this.cache){
      this.cache = await getLatestRelease()
    }
    return this.cache
  }
}

function find(assets:Asset[], val:string):number{
  let res;
  for(let idx = 0; idx < assets.length ; idx++){
    if(assets[idx].name == val){
      res = assets[idx].size
      break
    }
  }
  return res
}

// this function is so cool because, it also ensures incase a new update hits the file size would surely be different
// meaning that it would also download a newer version of ollama in that case making this a perfect fit for the problem
export async function checkSize(fileName: string, llocalSize: number): Promise<boolean> {
  const latestRelease = new GetLatestRelease()
  const assets = (await latestRelease.get()).assets
  // we can assign it to 0 because this function has a deterministic response unless 
  // ollama changes it's name formatting (quite possible) holy shit this is not optimal aswell
  const actualSize = find(assets, fileName)
  return llocalSize == actualSize
} 

async function getAssetUrl(fileName:string):Promise<string>{
  const latestRelease = new GetLatestRelease()
  const assets = (await latestRelease.get()).assets
  const response = assets.find(asset => asset.name == fileName)?.browser_download_url
  return response ?? ''
}
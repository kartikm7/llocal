import axios from 'axios'
import os from 'os'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import { downloadPath } from '.'
// import decompress from 'decompress';
// import decompressUnzip from 'decompress-unzip';
// import { error } from 'console'
import util from 'util';

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
    url: 'https://github.com/ollama/ollama/releases/download/v0.1.38/Ollama-darwin.zip'
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

// check os and resolve directory, this makes llocal os agnostic hopefully
function dir(): string {
  const operatingSystem = os.platform()
  console.log(operatingSystem)
  switch (operatingSystem) {
    case 'darwin':
      return path.join(downloadPath, 'binaries');
    case 'win32':
      return path.join(os.homedir(), 'AppData', 'Roaming','LLocal', 'binaries');
    default:
      return path.join(os.homedir(), '.config');
  }
}


export function binaryPath(binary: string): string[] {
  const val: binary = binaries[binary]
  // const directory = path.join(os.homedir(), 'AppData', 'Local', 'LLocal', 'binaries')

  // this ensures the directory is correct
  const directory = dir()
  const binaryDirectory = path.resolve(directory, val.name)
  return [binaryDirectory, binaryDirectory.replace(/\s/g, '^ ')]
}

export async function downloadBinaries(): Promise<string> {
  const operatingSystem = os.platform();

  const binary: binary = binaries[operatingSystem];
  if (!binary) return 'Not available for this platform';

  const directory = dir();
  console.log('Directory:', directory);
  if (!fs.existsSync(directory)) {
    console.log('Creating directory:', directory);
    fs.mkdirSync(directory, { recursive: true });
  }

  const binaryDirectory = path.join(directory, binary.name);
  if (fs.existsSync(binaryDirectory)) return 'exists';

  let filePath = '';
  if (operatingSystem === 'darwin') {
    filePath = path.resolve(directory, binary.name + '.zip');
  } else {
    filePath = path.resolve(directory, binary.name);
  }
  const execPromise = util.promisify(exec);

  try {
    const writer = fs.createWriteStream(filePath)
    const response = await axios.get(binary.url, { responseType: 'stream' })
    await new Promise<void>((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    if (operatingSystem === 'darwin') {
      await execPromise(`unzip ${filePath.replace(/\s/g, '\\ ')}`);
    }
    
    return 'success';
  } catch (error) {
    return 'error'
  }
}
import { app, shell, BrowserWindow, ipcMain, dialog, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { binaryNames, binaryPath, checkOllama, checkSize, downloadBinaries, installOllamaLinux } from './ollama-binaries'
import os from 'os'
import fs from 'fs'
import { exec } from 'child_process'
import process from 'node:process'
import { webSearch, webSearchType } from './websearch'
import { puppeteerSearch } from './puppeteer'
import { deleteVectorDb, getFileName, getSelectedFiles, getVectorDbList, saveVectorDb, similaritySearch } from './utils/rag-utils'
import { generateDocs } from './utils/docs-generator'
import path from 'path'
import pie from "puppeteer-in-electron"
import puppeteer from "puppeteer-core";
import i18next, { i18nConfig } from './lib/localization/i18n'
import i18n from './lib/localization/i18n'
import { fork } from 'child_process'
import ttsPath from "./workers/tts.ts?modulePath"
import { createPath } from './utils/utils'

// Handling dynamic imports the shell-path module, provides asynchronous functions
(async (): Promise<void> => {
  const { shellPathSync } = await import('shell-path')
  // This function fixes the shell errors for mac and possibly linux
  // The original code has been referenced from here: https://github.com/sindresorhus
  function fixPath(): void {
    if (process.platform === 'win32') {
      return
    }

    process.env.PATH =
      shellPathSync() ||
      ['./node_modules/.bin', '/.nodebrew/current/bin', '/usr/local/bin', process.env.PATH].join(
        ':'
      )
  }

  fixPath()
})()


function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    frame: true,
    roundedCorners: true,
    backgroundMaterial: 'acrylic',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// exporting downloads directory
export const downloadDirectory = app.getPath('downloads')
export const documentsDirectory = app.getPath('documents')
const { t } = i18n
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Autoupdater
  autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        title: t('Update Downloaded!'),
        message: t('A new version has been downloaded!'),
        buttons: [t('Go Ahead'), t('Release Notes'), t('Later')],
        detail: t('LLocal will be closed and the update will be installed!')
      })
      .then((click) => {
        if (click.response === 0) {
          autoUpdater.quitAndInstall()
        }
        if (click.response === 1) {
          shell.openExternal('https://github.com/kartikm7/llocal/releases')
        }
      })
  })

  // Serving ollama, if not present then performing the download function
  async function checkingOllama(): Promise<boolean> {
    const check = await checkOllama()
    console.log('Checking ollama', check)
    return check
  }

  const platform = os.platform()
  const downloadPath = binaryPath(platform)

  // Checking if binaries already exist
  async function checkingBinaries(): Promise<boolean> {
    return new Promise((resolve) => {
      if (fs.existsSync(downloadPath[0])) {
        resolve(true)
      } else {
        console.log('Checking behavior', false)
        resolve(false)
      }
    })
  }

  async function checkingBinarySize(): Promise<boolean> {
    const currentPath = downloadPath[0]
    const llocalSize: number = fs.statSync(currentPath).size
    return await checkSize(binaryNames[platform].name, llocalSize)
  }

  //  used when ollama is not downloaded
  async function downloadingOllama(): Promise<string> {
    const check = await checkOllama()
    if (!check) {
      // in the case where the platform is linux we execute this command and the rest is handled
      if (platform == 'linux') {
        const response = await installOllamaLinux()
        return response
      }
      // ollama is downloading
      const response = await downloadBinaries()
      if (response == 'success') {
        // ollama has been downloaded
        return 'success'
      } else {
        return 'download-failed'
      }
    }
    return 'already-present'
  }

  async function installingOllama(): Promise<boolean> {
    return new Promise((resolve) => {
      // mac-os has an edge case that needs to be dealt with
      if (platform == 'linux') {
        const check = checkingOllama() // we just check incase
        resolve(check) // resolve the check
      }
      if (platform == 'darwin') {
        // the path to the directory where it's extracting
        const extractDirectory = downloadPath[1].replace('/Ollama-darwin.zip', '')
        // this script ensures, the zip gets extracted and has the required permisions to execute
        exec(
          `unzip ${downloadPath[1]} -d ${extractDirectory} && chmod +x ${extractDirectory}/Ollama.app && ${extractDirectory}/Ollama.app/Contents/MacOS/Ollama`,
          (error) => {
            if (error == null) {
              // ollama has been installed
              resolve(true)
            } else {
              resolve(false)
            }
          }
        )
      } else {
        // so much easier on windows, with linux hopefully the logic just needs to be appended with mac
        exec(downloadPath[1], (error) => {
          if (error == null) {
            // ollama has been installed
            resolve(true)
          } else {
            resolve(false)
          }
        })
      }
    })
  }


  // the handlers are for interprocess communication
  ipcMain.handle('checkingOllama', async () => {
    const response = await checkingOllama()
    return response
  })

  ipcMain.handle('checkingBinaries', async () => {
    const response = await checkingBinaries()
    return response
  })

  ipcMain.handle('checkingBinarySize', async () => {
    const response = await checkingBinarySize()
    return response
  })

  ipcMain.handle('downloadingOllama', async () => {
    const response = await downloadingOllama()
    return response
  })

  ipcMain.handle('installingOllama', async () => {
    const response = await installingOllama()
    return response
  })

  ipcMain.handle('checkVersion', async () => {
    return new Promise((resolve) => {
      resolve(app.getVersion())
    })
  })

  ipcMain.handle('checkPlatform', async () => {
    return new Promise((resolve) => {
      resolve(platform)
    })
  })

  ipcMain.handle('experimentalSearch', async (_event, searchQuery: string, links: string[]) => {
    let response: webSearchType
    if (links.length > 0) response = await puppeteerSearch(searchQuery, links)
    else response = await webSearch(searchQuery)
    return response
  })

  ipcMain.handle('addKnowledge', async (_event, file = ""): Promise<addKnowledgeType> => {
    if (!file) {
      const { filePaths } = await getSelectedFiles()
      file = filePaths[0]
    }
    const fileName = getFileName(file);
    const docs = await generateDocs(file);
    const dir = path.join(app.getPath('documents'), 'LLocal', 'Knowledge Base', fileName)
    await saveVectorDb(docs, dir)
    return { path: dir, fileName: fileName };
  })

  ipcMain.handle('similaritySearch', async (_event, selectedKnowledge: addKnowledgeType[], prompt: string): Promise<ragReturn> => {
    const response = await similaritySearch(selectedKnowledge, prompt)
    return response
  })

  ipcMain.handle('getVectorDbList', async (): Promise<addKnowledgeType[]> => {
    return new Promise((resolve) => {
      resolve(getVectorDbList())
    })
  })

  ipcMain.handle('deleteVectorDb', async (_event, indexPath): Promise<boolean> => {
    return new Promise((resolve) => {
      resolve(deleteVectorDb(indexPath))
    })
  })

  ipcMain.handle('getLanguages', async (): Promise<readonly string[]> => {
    // building the config path, since we need to give an absolute path here to read this
    const configPath = path.join(app.getAppPath(), "resources/i18n.config.json")

    // reading the config
    const i18nConfig = JSON.parse(await fs.promises.readFile(configPath, { encoding: "utf-8" })) as i18nConfig

    return new Promise((resolve) => {
      // this is super cool, since i18next.languages is a readonly string[] but we can typecast it using the "as" keyword
      const languages = i18next.languages as string[]
      // reading the preferred language from the config
      const preferredLanguage = i18nConfig.preferredLanguage
      // here putting the preferredLanguage at the first index, so it's the default value in the ui aswell.
      let idx = -1
      for (idx = 0; idx < languages.length; idx++) {
        const value = languages[idx]
        if (value == preferredLanguage) {
          break
        }
      }

      // this swap is also super cool, because instead of making a "temp" variable we already have our temp variable in the form of the preferredLanguage
      languages[idx] = languages[0]
      languages[0] = preferredLanguage
      resolve(languages)
    })
  })
  // this type declaration makes no sense, because the type of getResource is any itself
  ipcMain.on('translate', (event, key, options = {}) => {
    event.returnValue = i18next.t(key, options)
  })

  ipcMain.handle('changeLanguage', async (_event, language: string): Promise<boolean> => {
    // what makes this so cool is that, we can manage preference from the backend itself
    return new Promise((resolve) => {
      i18next.changeLanguage(language).then(() => {
        console.log(language)
        // Putting it in the format required by the file
        const config = { preferredLanguage: language }
        // Overwriting the file
        fs.writeFile('resources/i18n.config.json', JSON.stringify(config), { encoding: "utf-8" }, (err) => {
          if (err) resolve(false)
          resolve(true)
        })
      })
    })
  })

  //  TODO: The issue, here is that we have to use fork, we actually spins up a new node instance so an addtional 50mb of sorts for the ram
  //  this would be a quick and clean fix with worker threads, but that's not an option at the moment since the kokoro-js npm package depends on
  //  onnxruntime-node version 1.21.1 and this got fixed  in 1.22.0 so what we can do is that we fork transformers.js and kokoro-js and update both
  //  of the packages to use our forks of the outdated dependencies or heck just wait.
  ipcMain.handle('textToSpeech', async (_event, text: string): Promise<ArrayBuffer> => {
    // Gosh I LOVE PROGRAMMING
    const cacheDir = createPath("HuggingFaceCache")
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true })

    function runService(): Promise<ArrayBuffer> {
      return new Promise((resolve, reject) => {
        const tts = fork(ttsPath, [text, cacheDir])
        tts.send(text)
        tts.on('message', (data) => {
          // @ts-ignore this is because, .data does exist on the buffer
          const arr = new Uint8Array(data.data)
          const { buffer } = arr
          resolve(buffer)
        });
        tts.on('exit', (code) => {
          reject(new Error(
            `Stopped the Worker Thread with the exit code: ${code}`));
        })
      })
    }
    return await runService()
  })


  createWindow()
  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


  const primaryDisplay = screen.getPrimaryDisplay()
  const workAreaSize = primaryDisplay.workAreaSize
  let previousBounds = { width: 900, height: 670 }
  const [mainWindow] = BrowserWindow.getAllWindows()
  ipcMain.on('titleBar', (_, event: string): void => {
    switch (event) {
      case 'minimize':
        mainWindow.minimize()
        break;
      case 'maximize':
        // this checks if the browser windows current size is less than (<) the max bounds of space left or not
        // incase it is less, then it emulates a maximize although it is not a true maximize.
        // But it does a pretty good job in my opinion.
        // Also, since there is a previousBounds variable keeping track of the previous bounds when the browser window and the maximum size available
        // are equal and the maximize event is triggered we simply set the bounds to the previous bounds.
        if (mainWindow.getBounds().width < workAreaSize.width && mainWindow.getBounds().height < workAreaSize.height) {
          previousBounds = mainWindow.getBounds()
          mainWindow.setBounds({ x: 0, y: 0, width: workAreaSize.width, height: workAreaSize.height })
        } else {
          mainWindow.setBounds(previousBounds)
        }
        break;
      case 'close':
        app.quit()
        break;
      default:
        break;
    }
  })
})

// TODO: It might be that, because it's loading directly in the window sometimes on JS driven sites that use the virtualDom,
// the scraping might fail. This can be patch through a hot fix await page.goto('https://www.llocal.in', waituntilsomething: {something})
// but this will load the site twice (would increase inference time)
export const loadWebsite = async (url: string): Promise<string> => {
  // @ts-ignore I think there is a type issue because of versions
  const browser = await pie.connect(app, puppeteer);
  const window = new BrowserWindow({ show: false })
  await window.loadURL(url);
  const page = await pie.getPage(browser, window);
  const content = await page.content()
  return content
}
pie.initialize(app)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { autoUpdater } from 'electron-updater'
import { binaryPath, checkOllama, downloadBinaries } from './ollama-binaries'
// import { dialog } from 'electron'
import os from 'os'
import fs from 'fs'
import { exec } from 'child_process'

autoUpdater.checkForUpdatesAndNotify()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
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

  // Serving ollama, if not present then performing the download function
  async function checkingOllama():Promise<boolean>{
    const check = await checkOllama()
    return check
  }
  
  const platform = os.platform()
  const path = binaryPath(platform)

  // Checking if binaries already exist
  async function checkingBinaries():Promise<boolean>{
    return new Promise((resolve)=>{
      if(fs.existsSync(path[0])){
        resolve(true)
      }else{
        resolve(false)
      }
    })
  }
  
  //  used when ollama is not downloaded
  async function downloadingOllama():Promise<string>{
    const check = await checkOllama()
    if (!check) {
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

  async function installingOllama():Promise<boolean>{
    return new Promise((resolve)=>{
      exec(path[1], (error) => {
        if (error == null) {
          // ollama has been installed
          resolve(true)
        }else {
          resolve(false)
        }
      })
    }
  
  ) 
  }

  // the handlers are for interprocess communication
  ipcMain.handle('checkingOllama', async () => {
    const response = await checkingOllama();
    return response
  })

  ipcMain.handle('checkingBinaries', async () => {
    const response = await checkingBinaries();
    return response
  })

  ipcMain.handle('downloadingOllama', async () => {
    const response = await downloadingOllama();
    return response
  })

  ipcMain.handle('installingOllama', async () => {
    const response = await installingOllama();
    return response
  })

  createWindow()

  app.on('activate', async function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

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

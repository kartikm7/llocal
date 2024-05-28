import { Ollama } from 'ollama/browser'
import { toast } from 'sonner'

export const ollama = new Ollama({ host: 'http://localhost:11434' })

async function installOllama(): Promise<void> {
  toast.info("Please be patient here, there are background process running to get Ollama up and running for you! (Should take about a mintue)")
  const install = await window.api.installingOllama()
  if (install) {
    toast.success('Ollama has been successfully installed!')
    setTimeout(() => {
      toast.info(
        'Whenever ollama is served, initially there is a cold-boot (slow start) and then it will work as expected. Anyways, you can now download models via Pull models in settings!'
      )
    }, 2000)
  } else {
    toast.error('Installation failed. (Press CTRL + R to refresh, or go to llocal.in)')
  }
}

export async function ollamaServe(setIsOllamaInstalled): Promise<void> {
  const check = await window.api.checkingOllama()
  if (!check) {
    const alreadyDownloaded = await window.api.checkingBinaries()

    if (alreadyDownloaded) {
      toast.info('Ollama setup has already been downloaded.')
      await installOllama()
    }
    // if not downloaded
    else {
      const toastId = toast.loading('Ollama has started downloading. This may take some time depending on your internet connection (Approx 200 MB)')
      const download = await window.api.downloadingOllama()
      toast.dismiss(toastId)
      if (download === 'success') {
        toast.success('Ollama has been downloaded!')
        setTimeout(async () => {
          await installOllama()
        }, 1000)
      }
      if (download === 'download-failed')
        toast.error('There has been some error while downloading ollama!')
    }
  } 
  // if check is true, set the atom state
  else{
    setIsOllamaInstalled(true)
  }
}

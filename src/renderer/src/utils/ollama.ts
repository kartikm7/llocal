import { Ollama } from 'ollama/browser'
import { toast } from 'sonner'

export const ollama = new Ollama({ host: 'http://localhost:11434' })

async function installOllama(): Promise<void> {
  const install = await window.api.installingOllama()
  if (install) {
    toast.success('Ollama has been successfully installed!')
    setTimeout(() => {
      toast.info(
        'Whenever ollama is served, initially there is a cold-boot (slow start) and then it will work as expected.'
      )
    }, 2000)
  } else {
    toast.error('Installation failed')
  }
}

export async function ollamaServe(): Promise<void> {
  const check = await window.api.checkingOllama()
  if (!check) {
    const alreadyDownloaded = await window.api.checkingBinaries()

    if (alreadyDownloaded) {
      toast.info('Ollama setup has already been downloaded.')
      await installOllama()
    }
    // if not downloaded
    else {
      // toast.info(
      //   'Ollama has started downloading. This may take time depending on your internet connection (Approx 200 MB)'
      // )
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
}

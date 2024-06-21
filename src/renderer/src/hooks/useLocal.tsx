import { backgroundImageAtom, darkModeAtom, prefModelAtom } from '@renderer/store/mocks'
import { useSetAtom } from 'jotai'
interface useLocalReturn {
  setBackground: (pref: string) => void
  setMode: (pref: boolean) => void
  setModelChoice: (pref: string) => void
}
export const useLocal = (): useLocalReturn => {
  const setBackgroundImage = useSetAtom(backgroundImageAtom)
  const setDarkMode = useSetAtom(darkModeAtom)
  const setPrefModel = useSetAtom(prefModelAtom)

  const setBackground = (pref: string): void => {
    if (pref == 'none') {
      localStorage.setItem('bg', pref)
      setBackgroundImage(pref)
    } else {
      const url = new URL(`/src/assets/themes/${pref}.svg`, import.meta.url).href
      localStorage.setItem('bg', url)
      setBackgroundImage(url)
    }
    localStorage.setItem('settingsState', pref)
  }

  const setMode = (pref: boolean): void => {
    localStorage.setItem('darkMode', `${pref}`)
    setDarkMode(pref)
  }

  const setModelChoice = (pref: string): void => {
    // the embed model should not be set as model choice
    if (pref?.includes('all-minilm')) return
    localStorage.setItem('prefModel', pref)
    setPrefModel(pref)
  }
  return { setBackground, setMode, setModelChoice }
}

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
      localStorage.setItem('bg', '/src/assets/themes/' + pref + '.svg')
      setBackgroundImage('/src/assets/themes/' + pref + '.svg')
    }
    localStorage.setItem('settingsState', pref)
  }

  const setMode = (pref: boolean): void => {
    localStorage.setItem('darkMode', `${pref}`)
    setDarkMode(pref)
  }

  const setModelChoice = (pref: string):void => {
    localStorage.setItem('prefModel', pref)
    setPrefModel(pref)
  } 
  return { setBackground, setMode, setModelChoice }
}

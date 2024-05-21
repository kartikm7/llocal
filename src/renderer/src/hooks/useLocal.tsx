import { backgroundImageAtom, darkModeAtom } from '@renderer/store/mocks'
import { useAtom } from 'jotai'
interface useLocalReturn {
  setBackground: (pref: string) => void
  setMode: (pref: boolean) => void
}
export const useLocal = (): useLocalReturn => {
  const [backgroundImage, setBackgroundImage] = useAtom(backgroundImageAtom)
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)
  

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
  return { setBackground, setMode }
}

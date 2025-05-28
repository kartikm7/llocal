import { backgroundImageAtom, modelListAtom, prefModelAtom, suggestionsAtom, transparencyModeAtom, } from '@renderer/store/mocks'
import { useSetAtom } from 'jotai'
import { listModels } from './useOllama'
interface useLocalReturn {
  setBackground: (pref: string) => void
  setModelChoice: (pref: string) => void
  setList: (list: listModels[]) => void
  setShowSuggestion: (pref: boolean) => void
  setTransparency: (pref: boolean) => void
}
export const useLocal = (): useLocalReturn => {
  const setBackgroundImage = useSetAtom(backgroundImageAtom)
  const setPrefModel = useSetAtom(prefModelAtom)
  const setModelList = useSetAtom(modelListAtom)
  const setSuggestions = useSetAtom(suggestionsAtom)
  const setTransparencyMode = useSetAtom(transparencyModeAtom)

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


  /*
   * Deprecated
   * */
  // const setMode = (pref: string): void => {
  //   localStorage.setItem('darkMode', `${pref}`)
  //   setDarkMode(pref)
  // }

  const setModelChoice = (pref: string): void => {
    // the embed model should not be set as model choice
    if (pref?.includes('all-minilm')) return
    localStorage.setItem('prefModel', pref)
    setPrefModel(pref)
  }

  const setList = (list: listModels[]): void => {
    setModelList(list)
    localStorage.setItem('modelList', JSON.stringify(list))
  }

  const setShowSuggestion = (pref: boolean): void => {
    localStorage.setItem('showSuggestions', String(pref))
    setSuggestions((pre) => ({ ...pre, show: pref }))
  }
  const setTransparency = (pref: boolean): void => {
    localStorage.setItem('transparencyMode', String(pref))
    setTransparencyMode(pref)
  }
  return { setBackground, setModelChoice, setList, setShowSuggestion, setTransparency }
}

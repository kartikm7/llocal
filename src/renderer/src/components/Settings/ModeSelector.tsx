import { useLocal } from '@renderer/hooks/useLocal'
import { darkModeAtom } from '@renderer/store/mocks'
import { Dropdown } from '@renderer/ui/Dropdown'
import { DropDownSelector } from '@renderer/ui/DropdownSelector'
import { useAtom } from 'jotai'
import { ChangeEvent } from 'react'

export const ModeSelector = (): React.ReactElement => {
  const { setMode } = useLocal()
  const [darkMode] = useAtom(darkModeAtom)
  function handleSelection(e: ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value
    if(value == 'dark') setMode(true)
    if(value == 'light') setMode(false)
  }

  return (
    <div className="flex flex-col gap-5 justify-center">
      <h1 className="font-thin">Mode Selector :</h1>
      <Dropdown onChange={handleSelection} defaultValue={darkMode ? 'dark' : 'light'} className="appearance-auto relative w-96">
        <DropDownSelector key={1} value={'dark'}>
          Dark
        </DropDownSelector>
        <DropDownSelector key={2} value={'light'}>
          Light
        </DropDownSelector>
      </Dropdown>
    </div>
  )
}

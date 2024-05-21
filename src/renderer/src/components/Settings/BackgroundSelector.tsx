import { useLocal } from '@renderer/hooks/useLocal'
import { backgroundImageAtom } from '@renderer/store/mocks'
import { Dropdown } from '@renderer/ui/Dropdown'
import { DropDownSelector } from '@renderer/ui/DropdownSelector'
import { useAtom } from 'jotai'
import { ChangeEvent } from 'react'

export const BackgroundSelector = (): React.ReactElement => {
  const themes = [
    { name: 'Galaxia', value: 'galaxia' },
    { name: 'Deep Blue', value: 'deepblue' },
    { name: 'Star Gazer', value: 'stargazer' },
    { name: 'None', value: 'none' }
  ]
  const [backgroundImage] = useAtom(backgroundImageAtom)
  const { setBackground } = useLocal()

  function handleSelection(e: ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value
    setBackground(value)
  }

  return (
    <div className="flex flex-col gap-5 justify-center">
      <h1 className="font-thin">Background Selector :</h1>
      <Dropdown
        onChange={handleSelection}
        defaultValue={`${localStorage.getItem('settingsState')}`}
        className="appearance-auto relative w-96"
      >
        {themes.map((val, index) => {
          return (
            <DropDownSelector key={index} value={val.value}>
              {val.name}
            </DropDownSelector>
          )
        })}
      </Dropdown>
    </div>
  )
}

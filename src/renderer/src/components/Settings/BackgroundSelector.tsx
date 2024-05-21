import { useLocal } from '@renderer/hooks/useLocal'
import { Dropdown } from '@renderer/ui/Dropdown'
import { DropDownSelector } from '@renderer/ui/DropdownSelector'
import { ChangeEvent } from 'react'
import { IoChevronDown } from "react-icons/io5";

export const BackgroundSelector = (): React.ReactElement => {
  const themes = [
    { name: 'Galaxia', value: 'galaxia' },
    { name: 'Deep Blue', value: 'deepblue' },
    { name: 'Star Gazer', value: 'stargazer' },
    { name: 'None', value: 'none' }
  ]
  const { setBackground } = useLocal()

  function handleSelection(e: ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value
    setBackground(value)
  }

  return (
    <div className="flex flex-col gap-2 justify-center">
      <h1 className="font-thin">Background Selector :</h1>
      <div className='relative'>
      <Dropdown
        onChange={handleSelection}
        defaultValue={`${localStorage.getItem('settingsState')}`}
        className="relative w-96"
      >
        {themes.map((val, index) => {
          return (
            <DropDownSelector key={index} value={val.value}>
              {val.name}
            </DropDownSelector>
          )
        })}
      </Dropdown>
      <IoChevronDown className='text-2xl absolute right-5 top-1/2 transform -translate-y-1/2' />
      </div>
    </div>
  )
}

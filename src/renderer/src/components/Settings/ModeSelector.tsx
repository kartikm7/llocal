import { useLocal } from '@renderer/hooks/useLocal'
import { darkModeAtom } from '@renderer/store/mocks'
import { Dropdown } from '@renderer/ui/Dropdown'
import { DropDownSelector } from '@renderer/ui/DropdownSelector'
import { t } from '@renderer/utils/utils'
import { useAtom } from 'jotai'
import { ChangeEvent } from 'react'
import { IoChevronDown } from 'react-icons/io5'

export const ModeSelector = (): React.ReactElement => {
  const { setMode } = useLocal()
  const [darkMode] = useAtom(darkModeAtom)
  function handleSelection(e: ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value
    switch (value) {
      case 'dark':
        setMode(true)
        break;
      case 'light':
        setMode(false)
        break;
      default:
        break;
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center">
      <h1 className="font-thin">{t("Mode Selector :")}</h1>
      <div className="relative">
        <Dropdown
          onChange={handleSelection}
          defaultValue={darkMode ? 'dark' : 'light'}
          className="w-96"
        >
          <DropDownSelector key={1} value={'dark'}>
            {t("Dark")}
          </DropDownSelector>
          <DropDownSelector key={2} value={'light'}>
            {t("Light")}
          </DropDownSelector>
        </Dropdown>
        <IoChevronDown className="text-2xl absolute right-5 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  )
}

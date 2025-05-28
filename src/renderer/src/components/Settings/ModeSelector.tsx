import { Dropdown } from '@renderer/ui/Dropdown'
import { DropDownSelector } from '@renderer/ui/DropdownSelector'
import { useTheme } from '@renderer/ui/ThemeProvider'
import { t } from '@renderer/utils/utils'
import { ChangeEvent } from 'react'
import { IoChevronDown } from 'react-icons/io5'

export const ModeSelector = (): React.ReactElement => {
  const { theme, setTheme } = useTheme()
  function handleSelection(e: ChangeEvent<HTMLSelectElement>): void {
    const value = e.target.value
    switch (value) {
      case 'dark':
        setTheme('dark')
        break;
      case 'light':
        setTheme('light')
        break;
      case 'system':
        setTheme('system')
        break;
      default:
        setTheme('dark')
        break;
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center">
      <h1 className="font-thin">{t("Mode Selector :")}</h1>
      <div className="relative">
        <Dropdown
          onChange={handleSelection}
          defaultValue={theme}
          className="w-96"
        >
          <DropDownSelector key={3} value={'system'}>
            {t("System")}
          </DropDownSelector>
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

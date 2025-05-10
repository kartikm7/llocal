import { languageAtom } from '@renderer/store/mocks'
import { Dropdown } from '@renderer/ui/Dropdown'
import { DropDownSelector } from '@renderer/ui/DropdownSelector'
import { t } from '@renderer/utils/utils'
import { useAtom } from 'jotai'
import React, { ChangeEvent, ComponentProps, useEffect, useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export const ChooseLanguage = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  const [language, setLanguage] = useAtom(languageAtom)
  const [list, setList] = useState<readonly string[]>([])
  useEffect(() => {
    async function list(): Promise<void> {
      const response = await window.api.getLanguages()
      setList(response)
    }
    list()
  }, [])

  async function handleChange(e: ChangeEvent<HTMLSelectElement>): Promise<void> {
    const val = e.target.value
    const response = await window.api.changeLanguage(val)
    if (response) toast.success(t('languageChangeSuccess', { language: val }))
    else toast.error(t('languageChangeError', { langauge: val }))
    setLanguage(val)
  }

  return (
    <div className={twMerge('flex flex-col gap-2 justify-center ', className)} {...props}>
      <h1 className="font-thin">{t('Choose Language :')}</h1>
      <div className="relative">
        <Dropdown defaultValue={language} onChange={handleChange} className="w-96">
          {list &&
            list.map((val, index) => {
              return (
                <DropDownSelector
                  key={index}
                  value={val}
                >{val}</DropDownSelector>
              )
            })}
        </Dropdown>
        <IoChevronDown className="text-2xl absolute right-5 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  )
}

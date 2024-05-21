import { settingsToggleAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom } from 'jotai'
import { ComponentProps } from 'react'
import { IoIosSettings } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

export const CommandCentre = ({className,...props}:ComponentProps<'div'>): React.ReactElement => {
  const [settingsToggle, setSettingsToggle] = useAtom(settingsToggleAtom)
  function handleClick():void{
    setSettingsToggle((preValue)=>!preValue)
  }
  return (
    <div className=''>
      <Card className={twMerge('flex flex-col gap-2 ', className)} {...props}>
        <h1 className="">TinyLlama 1.8B</h1>
        <div onClick={handleClick} className="flex gap-2 items-start cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
          <IoIosSettings className="text-2xl" />
          <h1>Settings</h1>
        </div>
      </Card>
    </div>
  )
}

import { isOllamaInstalledAtom, prefModelAtom, settingsToggleAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { ComponentProps, useEffect } from 'react'
import { IoIosSettings } from 'react-icons/io'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

export const CommandCentre = ({
  className,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  const setSettingsToggle = useSetAtom(settingsToggleAtom)
  const [prefModel] = useAtom(prefModelAtom)
  const isOllamaInstalled = useAtomValue(isOllamaInstalledAtom)

  useEffect(() => {
    // Not sure if this works
    if (!prefModel && isOllamaInstalled) {
      setTimeout(() => {
        toast.info('Download a LLM through settings!')
      }, 3000)
    }
  }, [])

  function handleClick(): void {
    setSettingsToggle((preValue) => !preValue)
  }
  return (
    <div className="">
      <Card className={twMerge('flex flex-col gap-2 ', className)} {...props}>
        <h1 className="">{prefModel || 'No LLM Found'}</h1>
        <div
          onClick={handleClick}
          className="flex gap-2 items-start cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
        >
          <IoIosSettings className="text-2xl" />
          <h1>Settings</h1>
        </div>
      </Card>
    </div>
  )
}

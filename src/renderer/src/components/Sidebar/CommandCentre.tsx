import { useLocal } from '@renderer/hooks/useLocal'
import { useOllama } from '@renderer/hooks/useOllama'
import { isOllamaInstalledAtom, prefModelAtom, settingsToggleAtom } from '@renderer/store/mocks'
import { Card } from '@renderer/ui/Card'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { ComponentProps, useEffect } from 'react'
import { IoIosSettings } from 'react-icons/io'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { t } from '@renderer/utils/utils'

export const CommandCentre = ({
  className,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  const setSettingsToggle = useSetAtom(settingsToggleAtom)
  const [prefModel] = useAtom(prefModelAtom)
  const isOllamaInstalled = useAtomValue(isOllamaInstalledAtom)
  const { listModels } = useOllama()
  const { setModelChoice } = useLocal()
  useEffect(() => {
    /**
     * This function checks for if the previously prefered model has been
     * deleted or not and handles scenarios depending on if there are existing models or not.
      */
    async function autoChecksAndSets(): Promise<void> {
      const list = await listModels()
      // if the user deletes the model, then to handle this edge case we do the following
      if (prefModel && !list.find(val => val.modelName == prefModel)) {
        // this is incase, there are other models present
        if (list.length > 0) setModelChoice(list[0].modelName)
        else setModelChoice('') // this is for when there are no models pulled
      }
      // This condition is true when there is no model in the list
      // Not sure if this works (Update: IT DOES WORK HAHAHA)
      if (!prefModel && isOllamaInstalled) {
        setTimeout(() => {
          toast.info(t('Download a LLM through settings!'))
        }, 3000)
      }
    }
    autoChecksAndSets()
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
          <h1>{t("Settings")}</h1>
        </div>
      </Card>
    </div>
  )
}

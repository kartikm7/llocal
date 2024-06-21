import { Button } from '@renderer/ui/Button'
import { Menu, MenuSelector } from '@renderer/ui/Menu'
import { cn } from '@renderer/utils/utils'
import { ChangeEvent, ComponentProps, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { LuImage } from 'react-icons/lu'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { experimentalSearchAtom, imageAttatchmentAtom, modelListAtom } from '@renderer/store/mocks'
import { toast } from 'sonner'
import { Separator } from '@renderer/ui/Separator'
import { Checkbox } from '@renderer/ui/Checkbox'

export const MoreButton = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  // initializing state to show menu
  const [showMenu, setShowMenu] = useState(false)
  const setImageAttachment = useSetAtom(imageAttatchmentAtom)
  const [experimentalSearch, setExperimentalSearch] = useAtom(experimentalSearchAtom)
  const modelList = useAtomValue(modelListAtom)
  function handleClick(): void {
    // checking if the embedding model exists
    let check = false
    for (let i = 0; i < modelList.length; i++) {
      if (modelList[i].modelName.includes('all-minilm')) {
        check = true
        break
      }
    }

    // if it does not exist
    if (!check) {
      // it throws a warning toast
      toast.warning(
        'Embedding model has not been pulled yet, you must do that through settings to use web-search!'
      )
      // also updating the search, just incase
      setExperimentalSearch(false)
      return
    }

    // in the case the check is true, we allow the web search toggle
    setExperimentalSearch((prev) => !prev)
    // I got no explanation for why this works
    if (!experimentalSearch) {
      toast.success('Web search is on! (This feature is experimental)')
    } else {
      toast.info('Web search is off now! (This feature is experimental)')
    }
  }

  // converting the image to base64
  const handleImage = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const file = e.target.files[0]
      // Make new FileReader
      const reader = new FileReader()
      // Convert the file to base64 text
      reader.readAsDataURL(file)
      // on reader load somthing...
      reader.onload = (): void => {
        // Make a fileInfo Object
        const base64 = reader.result?.toString().split('base64,')
        if (base64) {
          setImageAttachment(`${base64[1]}`)
          // console.log(base64[1]);
        }
        toast.success('The image has been processed! Please make sure a vision model is selected')
      }
    }
  }

  return (
    <div className={cn('relative flex flex-col justify-center items-center', className)} {...props}>
      {showMenu && (
        <Menu className="flex flex-col justify-center items-center gap-2">
          <MenuSelector>
            <label htmlFor="images" className="flex items-center gap-2 cursor-pointer">
              <LuImage className="text-2xl" /> Upload an image
            </label>
            <input
              type="file"
              className="hidden"
              id="images"
              accept="image/*"
              onChange={handleImage}
            />
          </MenuSelector>
          <Separator />
          <MenuSelector onClick={handleClick} className="cursor-pointer flex items-center gap-2">
            <Checkbox isExternalState={true} externalState={experimentalSearch} /> Web search
          </MenuSelector>
        </Menu>
      )}
      <Button
        type="button"
        onClick={() => {
          setShowMenu((prev) => !prev)
        }}
        variant="icon"
      >
        <IoIosAddCircle className={`${showMenu && 'rotate-45'} transition-all`} />
      </Button>
    </div>
  )
}

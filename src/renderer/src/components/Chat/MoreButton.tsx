import { Menu, MenuContent, MenuItem, MenuTrigger } from '@renderer/ui/Menu'
import { cn, t } from '@renderer/utils/utils'
import { ChangeEvent, ComponentProps } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { LuFile, LuImage } from 'react-icons/lu'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { experimentalSearchAtom, fileContextAtom, imageAttatchmentAtom, modelListAtom } from '@renderer/store/mocks'
import { toast } from 'sonner'
import { Checkbox } from '@renderer/ui/Checkbox'

export const MoreButton = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  // initializing state to show menu
  const setImageAttachment = useSetAtom(imageAttatchmentAtom)
  const [experimentalSearch, setExperimentalSearch] = useAtom(experimentalSearchAtom)
  const modelList = useAtomValue(modelListAtom)
  const setFile = useSetAtom(fileContextAtom);
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
        t('Embedding model has not been pulled yet, you must do that through settings to use web-search!')
      )
      // also updating the search, just incase
      setExperimentalSearch(false)
      return
    }

    // in the case the check is true, we allow the web search toggle
    setExperimentalSearch((prev) => !prev)
    // I got no explanation for why this works
    if (!experimentalSearch) {
      toast.success(t('Web search is on! (This feature is experimental)'))
    } else {
      toast.info(t('Web search is off now! (This feature is experimental)'))
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
        toast.success(t('The image has been processed! Please make sure a vision model is selected'))
      }
    }
  }

  const handleAddFile = async (): Promise<void> => {
    const toastId = toast.loading(t(`Adding to the knowledge base`))
    try {
      const response = await window.api.addKnowledge()
      setFile([response])
      toast.success(t('fileAdded', { fileName: response.fileName }), { id: toastId })
    } catch (error) {
      const splits = String(error).split(":")
      toast.error(`${splits[splits.length - 1]}`, { id: toastId })
    }
  }

  return (
    <div className={cn('flex flex-col justify-center items-center ', className)} {...props}>
      <Menu modal={false}>
        <MenuTrigger className='data-[state=open]:rotate-45 opacity-50 hover:opacity-100 transition-all'>
          <IoIosAddCircle className='' />
        </MenuTrigger>
        <MenuContent className="flex flex-col justify-center items-center gap-2">
          <MenuItem onClick={handleAddFile} className='flex items-center w-full gap-2 cursor-pointer'>
            <LuFile className='text-2xl' /> Add file
          </MenuItem>
          <MenuItem onSelect={(e) => e.preventDefault()} onInput={handleImage} className='w-full'>
            <label htmlFor="images" className="flex items-center gap-2 cursor-pointer">
              <LuImage className="text-2xl" /> Upload an image
            </label>
            <input
              type="file"
              className="hidden"
              id="images"
              accept="image/*"
            />
          </MenuItem>
          <MenuItem onSelect={(e) => e.preventDefault()} onClick={handleClick} className="w-full cursor-pointer flex items-center gap-2">
            <Checkbox isExternalState={true} externalState={experimentalSearch} /> Web search
          </MenuItem>
        </MenuContent>
      </Menu >
    </div>
  )
}

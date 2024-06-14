import { Button } from '@renderer/ui/Button'
import { Menu, MenuSelector } from '@renderer/ui/Menu'
import { cn } from '@renderer/utils/utils'
import { ChangeEvent, ComponentProps, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { FaImages } from 'react-icons/fa6'
import { useSetAtom } from 'jotai'
import { imageAttatchmentAtom } from '@renderer/store/mocks'
import { toast } from 'sonner'

export const MoreButton = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {
  // initializing state to show menu
  const [showMenu, setShowMenu] = useState(false)
  const setImageAttachment = useSetAtom(imageAttatchmentAtom)

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
          console.log(base64[1]);
          
        }
        toast.success("The image has been processed! Please make sure a vision model is selected")
      }
    }
  }
  
  return (
    <div className={cn('relative flex flex-col justify-center items-center', className)} {...props}>
      {showMenu && (
        <Menu>
          <MenuSelector>
            <label
              htmlFor="images"
              className="flex justify-center items-center gap-2 cursor-pointer"
            >
              <FaImages className="text-2xl" /> Upload an image
            </label>
            <input
              type="file"
              className="hidden"
              id="images"
              accept="image/*"
              onChange={handleImage}
            />
          </MenuSelector>
        </Menu>
      )}
      <Button onClick={() => setShowMenu((prev) => !prev)} variant="icon">
        <IoIosAddCircle className={`${showMenu && 'rotate-45'} transition-all`} />
      </Button>
    </div>
  )
}

import { ComponentProps, useState, DragEvent } from 'react'
import { twMerge } from 'tailwind-merge'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'
import { AiFillCloseCircle } from 'react-icons/ai'
import { fileDropAtom, settingsToggleAtom } from '@renderer/store/mocks'
import { useAtom, useSetAtom } from 'jotai'
import { cn, t } from '@renderer/utils/utils'
import { useFileDrop } from '@renderer/hooks/useFileDrop'

export const RootLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>): React.ReactElement => {
  return (
    <main className={twMerge('h-full w-full flex flex-row', className)} {...props}>
      {children}
    </main>
  )
}

export const Settings = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  const [settingsToggle, setSettingsToggle] = useAtom(settingsToggleAtom)
  function handleClick(): void {
    setSettingsToggle((preValue) => !preValue)
  }
  return (
    <>
      {settingsToggle && (
        <div
          className={twMerge(
            `dark:bg-black dark:bg-opacity-50 bg-foreground bg-opacity-50 absolute z-30 flex flex-col justify-center items-center w-full h-screen backdrop-blur p-5 overflow-y-scroll overflow-x-hidden`,
            className
          )}
          {...props}
        >
          <div className=" sticky top-5 left-5 w-full  ">
            <div
              onClick={handleClick}
              className="flex opacity-50 gap-1 cursor-pointer hover:opacity-100 transition-all w-fit"
            >
              <AiFillCloseCircle className="text-2xl " />
              <h1 className="">{t("Close")}</h1>
            </div>
          </div>
          {children}
        </div>
      )}
    </>
  )
}

export const ModelConfiguration = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  return (
    <div className={twMerge('', className)} {...props}>
      {children}
    </div>
  )
}

export const Sidebar = ({
  className,
  children,
  ...props
}: ComponentProps<'aside'>): React.ReactElement => {
  const [open, setOpen] = useState(true)
  return (
    <div className={`flex gap-2 items-center justify-center bg-transparent`}>
      <aside
        className={twMerge(
          `transition-transform transform ${open ? 'translate-x-0 w-[250px] h-screen p-5' : '-translate-x-full w-0'} `,
          className
        )}
        {...props}
      >
        {open && children}
      </aside>
      {open ? (
        <IoIosArrowBack
          onClick={() => setOpen((preValue) => !preValue)}
          className="text-2xl cursor-pointer opacity-50"
        />
      ) : (
        <IoIosArrowForward
          onClick={() => setOpen((preValue) => !preValue)}
          className="absolute cursor-pointer left-1 text-2xl opacity-50"
        />
      )}
    </div>
  )
}

export const Chat = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  const setFileDrop = useSetAtom(fileDropAtom)
  const { handleDrop } = useFileDrop()
  function handleEvent(e: DragEvent, val: boolean) {
    e.preventDefault()
    setFileDrop(val)
  }
  return (
    <aside onDrop={handleDrop} onDragOver={(e) => handleEvent(e, true)} onDragLeave={(e) => handleEvent(e, false)} className={twMerge('flex-1 overflow-hidden pt-10 pb-6 px-8 lg:pt-8', className)} {...props}>
      {children}
    </aside>
  )
}

export const TitleBarLayout = ({ className, children, ...props }: ComponentProps<'div'>): React.ReactElement => {
  return <div className={cn("", className)} {...props}>
    {children}
  </div>
}

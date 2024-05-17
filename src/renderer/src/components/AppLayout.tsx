import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { AnimatePresence, MotionProps, motion, useCycle } from 'framer-motion'
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io'

export const RootLayout = ({
  className,
  children,
  ...props
}: ComponentProps<'main'>): React.ReactElement => {
  return (
    <main className={twMerge('flex flex-row', className)} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({
  className,
  children,
  ...props
}: ComponentProps<'aside'> & MotionProps): React.ReactElement => {
  const [open, sideBarClose] = useCycle(false, true)
  return (
    <div className="flex gap-2 items-center justify-center bg-transparent">
    <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{ width: 250, transition: {type: "spring", bounce: 0, duration: 0.4 } }}
            exit={{ width: 0, transition: {type: "spring", bounce: 0, duration: 0.1 } }}
            className={twMerge('w-[250px] h-screen p-5', className)}
            {...props}
          >
            {children}
          </motion.aside>
        )}

    </AnimatePresence>
    {open ? (
          <IoIosArrowBack onClick={sideBarClose} className="text-2xl dark:text-black" />
        ) : (
          <IoIosArrowForward onClick={sideBarClose} className="absolute left-1 text-2xl dark:text-black opacity-50" />
        )}
    </div>
  )
}

export const Chat = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  return (
    <aside className={twMerge('flex-1 h-screen p-5', className)} {...props}>
      {children}
    </aside>
  )
}

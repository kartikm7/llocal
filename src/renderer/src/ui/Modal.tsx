import { Portal, cn } from "@renderer/utils/utils"
import { ComponentProps, Dispatch, ReactElement, createContext, useContext, useState } from "react"
import { Card } from "./Card";
import { SetStateAction } from "jotai";
import { useClickOutside } from "@renderer/hooks/useClickOutside";
import { Button, ButtonProps } from "./Button";

interface ModalContextInterface {
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}

interface ModalProps extends ComponentProps<'div'> {
  open?: boolean
}

const ModalContext = createContext<ModalContextInterface | null>(null)
const ModalProvider = ModalContext.Provider

const Root = ({ className, children, ...props }: ModalProps): ReactElement => {
  const [isOpen, setOpen] = useState(false)
  // useEffect(() => {
  //   setOpen(open)
  // }, [open])
  // this is so confusing, but I think to use it, the abstracted prop names are suitable
  return (
    <ModalProvider value={{ isOpen, setOpen }} {...props}>
      {children}
    </ModalProvider>
  );
};


const Trigger = ({ children, ...props }: ComponentProps<'div'>): ReactElement | null => {
  const context = useContext(ModalContext)
  if (!context) return null
  const { setOpen } = context
  return <div onClick={() => {
    setOpen(true)
  }} {...props}>{children}</div>
}

const Content = ({ children, className, ...props }: ComponentProps<'div'>): ReactElement | null => {
  const context = useContext(ModalContext)
  if (!context) return null
  const { isOpen, setOpen } = context
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false))
  return <>
    {isOpen && Portal(<div ref={ref} className={cn("fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-auto z-50 overflow-visible flex items-center justify-center", className)} {...props}>
      <Card className="">{children}</Card>
    </div>)
    }
  </>
}

const Header = ({ className, children, ...props }: ComponentProps<'h2'>): ReactElement | null => {
  return <h2 className={cn("", className)} {...props}>{children}</h2>
}

const Description = ({ className, children, ...props }: ComponentProps<'h2'>): ReactElement => {
  return <p className={cn("", className)} {...props}>{children}</p>
}

const Overlay = ({ className, children, ...props }: ComponentProps<'div'>): ReactElement | null => {
  const context = useContext(ModalContext)
  if (!context) return null
  const { isOpen } = context
  return <>
    {isOpen && Portal(<div className={cn("dark:bg-black dark:bg-opacity-50 bg-foreground bg-opacity-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 m-auto z-40 w-screen h-screen", className)} {...props}>{children}</div>)}
  </>
}

const CancelTrigger = ({ children, ...props }: ComponentProps<'div'>): ReactElement | null => {
  const context = useContext(ModalContext)
  if (!context) return null
  const { setOpen } = context
  return <div onClick={() => setOpen(false)} {...props}>
    {children}
  </div>
}

interface AcceptTriggerProps extends ButtonProps { callbackFn?: () => void }
const AcceptTrigger = ({ children, callbackFn, ...props }: AcceptTriggerProps): ReactElement | null => {
  const context = useContext(ModalContext)
  if (!context) return null
  const { setOpen } = context
  return <Button onClick={(e) => {
    if (callbackFn) {
      e.preventDefault()
      callbackFn()
      setOpen(false)
    }
  }}   {...props}>
    {children}
  </Button>
}

const Form = ({ children, onSubmit, ...props }: ComponentProps<'form'>): ReactElement | null => {
  const context = useContext(ModalContext)
  if (!context) return null
  const { setOpen } = context
  return <form onSubmit={(e) => {
    if (onSubmit) onSubmit(e)
    setOpen(false)
  }
  } {...props}>{children}</form>
}

export const Modal = { Root, Trigger, Content, Header, Description, Form, CancelTrigger, AcceptTrigger, Overlay }

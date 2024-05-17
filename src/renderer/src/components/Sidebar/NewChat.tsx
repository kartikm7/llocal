import { Card } from '@renderer/ui/Card'
import Logo from '../../assets/logo.svg'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const NewChat = ({className, ...props}:ComponentProps<'div'>): React.ReactElement => {
  return (
    <div className={twMerge('', className)} {...props}>
      <Card className="flex items-center gap-3 p-3 bg-opacity-10 dark:bg-opacity-10 hover:bg-opacity-50 transition-opacity cursor-pointer">
        <img src={Logo} alt="" className="size-12" />
        <h1>Start a chat</h1>
      </Card>
    </div>
  )
}

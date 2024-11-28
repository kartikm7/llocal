import { cn } from '@renderer/utils/utils'
import { ComponentProps } from 'react'
import { Card } from './Card'

export const BreadCrumb = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  return (
    <Card className={cn('w-fit text-xs p-2 rounded-xl cursor-pointer opacity-50 hover:opacity-100 transition-all', className)} {...props}>
      {children}
    </Card>
  )
}

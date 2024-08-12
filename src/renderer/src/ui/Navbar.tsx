import React, { ComponentProps } from 'react'
import { Card } from './Card'
import { cn } from '@renderer/utils/utils'

export const NavbarItem = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  return (
    <Card className={cn( 'p-3 px-6 w-fit text-center opacity-50 hover:opacity-100 transition-all cursor-pointer',className)} {...props}>
      {children}
    </Card>
  )
}

export const Navbar = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  return (
    <Card className={cn('flex w-fit gap-2 justify-center items-center p-3 px-4',className)} {...props}>
      {children}
    </Card>
  )
}

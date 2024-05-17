import Input from '@renderer/ui/Input'
import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const InputForm = ({ className, ...props }: ComponentProps<'form'>): React.ReactElement => {
  return (
    <form className={twMerge('', className)} {...props}>
      <Input />
    </form>
  )
}

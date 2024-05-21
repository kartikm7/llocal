import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const OllamaConfiguration = ({
  className,
  ...props
}: ComponentProps<'div'>): React.ReactElement => {
  return <div className={twMerge('', className)} {...props}>
    <h1>Model Configuration<h1>
    </div>
}

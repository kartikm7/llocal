import React, { ComponentProps } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

type customProps = {
  register: UseFormRegister<FieldValues>;
}

export const Input = (props:ComponentProps<'input'>&customProps): React.ReactElement => {
  return (
    <input
      placeholder={props.placeholder}
      className={twMerge(
        'p-5 bg-foreground dark:bg-opacity-20 dark:bg-background dark:text-white dark:placeholder-white placeholder:opacity-80 dark:placeholder:opacity-60 outline-none rounded-full text-sm bg-opacity-20  backdrop-blur-lg shadow-xl',
        props.className
      )}
      {...props.register(props.name)}
      type="text"
    />
  )
}

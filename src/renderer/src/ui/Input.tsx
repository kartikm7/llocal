import React, { ComponentProps } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

type customProps = {
  register: UseFormRegister<FieldValues>;
}

export const Input = (props:ComponentProps<'input'>&customProps): React.ReactElement => {
  return (
    <input
      placeholder={props.disabled ? "Loading..." :props.placeholder }
      className={twMerge(
        'p-5 bg-foreground placeholder:text-black placeholder:text-opacity-60 dark:bg-opacity-20 dark:bg-background dark:text-white dark:placeholder-white  dark:placeholder:opacity-60 outline-none rounded-full text-sm bg-opacity-20  backdrop-blur-lg shadow-xl',
        props.className
      )}
      value={props.value}
      {...props.register(props.name || '')}
      type="text"
      disabled = {props.disabled}
    />
  )
}

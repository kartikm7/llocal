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
        'p-5 bg-black placeholder-white outline-none rounded-full text-sm bg-opacity-20 text-white backdrop-blur-lg shadow-xl',
        props.className
      )}
      {...props.register(props.name)}
      type="text"
    />
  )
}

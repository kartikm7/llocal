import { ComponentProps } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

interface TextAreaProps extends ComponentProps<'textarea'> {
  register: UseFormRegister<FieldValues>
}

export const TextArea = ({ className, ...props }: TextAreaProps): React.ReactElement => {
  return (
    <textarea
      id='textarea'
      className={twMerge(
        'p-3 px-4 resize-none overflow-auto bg-foreground placeholder:text-black placeholder:text-opacity-60 dark:bg-opacity-20 dark:bg-background dark:text-white dark:placeholder-white  dark:placeholder:opacity-60 outline-none rounded-full text-sm bg-opacity-20 backdrop-blur-lg shadow-xl',
        className
      )}
      disabled={props.disabled}
      placeholder={props.disabled ? 'Loading...' : props.placeholder}
      onKeyDown={props.onKeyDown}
      {...props.register(props.name || '')}
    />
  )
}

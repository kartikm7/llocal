import { ComponentProps } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@renderer/utils/utils';

interface TextAreaProps extends ComponentProps<'textarea'>, VariantProps<typeof TextAreaVariants> {
  register: UseFormRegister<FieldValues>;
  // handleChange(e: ChangeEvent<HTMLTextAreaElement>): void
}


const TextAreaVariants = cva('', {
  variants: {
    variant: {
      'chat': 'p-3 px-4 pt-[14px] resize-none overflow-auto bg-foreground placeholder:text-black placeholder:text-opacity-60 dark:bg-opacity-20 dark:bg-background dark:text-white dark:placeholder-white  dark:placeholder:opacity-60 outline-none rounded-full text-sm bg-opacity-20 backdrop-blur-lg shadow-xl',
      'base': 'p-3 px-4 resize-none overflow-auto bg-foreground placeholder:text-black placeholder:text-opacity-60 dark:bg-opacity-20 dark:bg-background dark:text-white dark:placeholder-white  dark:placeholder:opacity-60 outline-none rounded-3xl text-sm bg-opacity-20 backdrop-blur-lg',
    }
  },
  defaultVariants: {
    variant: 'base'
  }
})

export const TextArea = ({ className, variant, onChange, ...props }: TextAreaProps): React.ReactElement => {

  return (
    <textarea
      id='textarea'
      className={cn(TextAreaVariants({ variant, className }))}
      disabled={props.disabled}
      placeholder={props.disabled ? 'Loading...' : props.placeholder}
      onKeyDown={props.onKeyDown}
      {...props.register(props.name || '', {
        onChange(event): void {
          if (onChange) onChange(event)
        }
      })}
      {...props}
    />
  )
}

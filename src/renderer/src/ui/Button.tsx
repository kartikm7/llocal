import { cn } from '@renderer/utils/utils'
import { ComponentProps } from 'react'
import { VariantProps, cva } from 'class-variance-authority'

const ButtonVariants = cva('', {
  variants: {
    variant: {
      icon: 'hover:scale-105 disabled:transition-none disabled:opacity-50 opacity-60 hover:opacity-100 transition-all p-2',
      link: 'hover:underline hover:scale-[0.98] opacity-60 hover:opacity-100 transition-all',
      breadcrumb: 'w-fit text-xs p-2 rounded-xl cursor-pointer opacity-50 hover:opacity-100 transition-all',
      primary: 'hover:scale-95 disabled:transition-none disabled:opacity-50 opacity-60 hover:opacity-100 transition-all bg-background bg-opacity-30 hover:opacity-50 p-2 px-3 rounded-xl',
      secondary: 'hover:scale-95 disabled:transition-none disabled:opacity-50 opacity-60 hover:opacity-100 transition-all p-2 px-3 rounded-xl'
    }
  },
  defaultVariants: {
    variant: 'icon'
  }
})

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof ButtonVariants> { }
export const Button = ({
  className,
  variant,
  type,
  children,
  ...props
}: ButtonProps): React.ReactElement => {
  return (
    <button type={type} className={cn(ButtonVariants({ variant, className }))} {...props}>
      {children}
    </button>
  )
}

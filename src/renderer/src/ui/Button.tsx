import { cn } from '@renderer/utils/utils'
import { ComponentProps } from 'react'
import { VariantProps, cva } from 'class-variance-authority'

const ButtonVariants = cva('', {
  variants: {
    variant: {
      icon: 'hover:scale-105 disabled:transition-none disabled:opacity-50 opacity-60 hover:opacity-100 transition-all',
      link: 'hover:underline hover:scale-[0.98] opacity-60 hover:opacity-100 transition-all'
    }
  },
  defaultVariants: {
    variant: 'icon'
  }
})

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof ButtonVariants>{}

export const Button = ({
  className,
  variant,
  type,
  children,
  ...props
}: ButtonProps): React.ReactElement => {
  return (
    <button  type={type} className={cn(ButtonVariants({variant, className}))} {...props}>
      {children}
    </button>
  )
}

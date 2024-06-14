import { cn } from '@renderer/utils/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { ComponentProps } from 'react'
import { Button } from './Button'

export const MenuSelector = ({className,children, ...props}:ComponentProps<'button'>): React.ReactElement => {
  return <Button className={cn('w-full', className)}  variant='link' {...props}>{children}</Button>
}

const MenuVariants = cva('', {
  variants: {
    variant: {
      top: 'bottom-10'
    }
  },
  defaultVariants: {
    variant: 'top'
  }
})

interface MenuProps extends ComponentProps<'div'>, VariantProps<typeof MenuVariants> {}

export const Menu = ({ className, variant, children, ...props }: MenuProps): React.ReactElement => {
  return (
    <div className={cn( 'absolute w-44 flex flex-col justify-center items-center bg-background bg-opacity-30 text-sm p-2 rounded-2xl backdrop-blur-xl transition-all',MenuVariants({variant, className}))} {...props}>
      {children}
    </div>
  )
}

import { cn } from '@renderer/utils/utils'
import { ComponentProps } from 'react'
import { Card } from './Card'
import { VariantProps, cva } from 'class-variance-authority'


const BreadCrumbVariants = cva('', {
  variants: {
    variant: {
      base: 'w-fit text-xs p-2 rounded-xl cursor-pointer opacity-50 hover:opacity-100 transition-all',
      raw: 'w-fit text-xs p-2 rounded-xl cursor-none transition-all'
    }
  },
  defaultVariants: {
    variant: 'base'
  }
})

interface BreadCrumbProps extends ComponentProps<'div'>, VariantProps<typeof BreadCrumbVariants> { }
export const BreadCrumb = ({
  className,
  children,
  variant,
  ...props
}: BreadCrumbProps): React.ReactElement => {
  return (
    <Card className={cn(BreadCrumbVariants({ variant, className }))} {...props}>
      {children}
    </Card>
  )
}

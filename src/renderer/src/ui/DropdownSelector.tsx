import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const DropDownSelector = ({
  className,
  children,
  ...props
}: ComponentProps<'option'>): React.ReactElement => {
  return (
    <option className={twMerge(' bg-foreground dark:bg-background dark:text-white dark:placeholder-white   rounded-full', className)} value={props.value}>
      {children}
    </option>
  )
}

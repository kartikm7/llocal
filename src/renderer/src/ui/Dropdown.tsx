import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Dropdown = ({
  className,
  children,
  ...props
}: ComponentProps<'select'>): React.ReactElement => {
  return (
    <select
      className={twMerge(
        'relative appearance-none h-16 p-5 bg-foreground hover:bg-opacity-50 dark:bg-opacity-20 dark:bg-background dark:text-white dark:placeholder-white placeholder:opacity-80 dark:placeholder:opacity-60 outline-none rounded-full text-sm bg-opacity-20  backdrop-blur-lg shadow-xl',
        className
      )}
      title={props.title}
      {...props}
    >
      {children}
    </select>
  )
}

import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export const Separator = ({className, ...props}:ComponentProps<'div'>):React.ReactElement => {
  return <div className={twMerge("w-full h-[2px] opacity-50 bg-background dark:bg-foreground", className)} {...props}>
  </div>
}
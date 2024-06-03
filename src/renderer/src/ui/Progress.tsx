import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

interface ProgressProps extends ComponentProps<'div'>{
  value: number
}

export const Progress = ({className, value=0,...props}:ProgressProps):React.ReactElement => {
  return <div style={{width:`${value}%` }} className={twMerge(`bg-background dark:bg-foreground rounded-md h-1 transition-all` , className)} {...props} />
}
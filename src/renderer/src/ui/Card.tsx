import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const Card = ({className, children,...props}:ComponentProps<'div'>):React.ReactElement => {
  return <div className={twMerge('bg-opacity-20 dark:bg-opacity-20 backdrop-blur-lg bg-foreground dark:bg-background p-5 rounded-2xl max-w-full', className)} {...props}>
    {children}
  </div>
}
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const IconButton = ({className, children ,...props}: ComponentProps<'div'>):React.ReactElement => {
  return <button className={twMerge("hover:scale-105 transition-all")} {...props}>{children}</button>
}
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const IconButton = ({className, type,children ,...props}: ComponentProps<'button'>):React.ReactElement => {
  return <button type={type} className={twMerge("hover:scale-105 transition-all", className)} {...props}>{children}</button>
}
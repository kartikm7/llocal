import { cn } from "@renderer/utils/utils"
import { ComponentProps } from "react"
import { CopyButton } from "./CopyButton"

export const Table = ({ children, className, ...props }: ComponentProps<'table'>): React.ReactElement => {
  return (
    <table className={cn('group relative', className)} {...props}>
      <CopyButton className="hidden group-hover:flex absolute right-0 top-0  transition-all" isTable children={children} />
      {children}
    </table>
  )
}

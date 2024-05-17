import { Card } from "@renderer/ui/Card";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export const ChatList = ({className,...props}:ComponentProps<'div'>):React.ReactElement => {
  return <div className={twMerge('flex flex-col gap-2 overflow-auto', className)} {...props}>
    <Card className="cursor-pointer opacity-50 hover:opacity-100 transition-opacity"><h1 className="line-clamp-1">What is Lorem Ipsum?</h1></Card>
  </div>
}
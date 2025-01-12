import { Button } from "@renderer/ui/Button";
import { cn } from "@renderer/utils/utils";
import { ComponentProps, ReactElement } from "react";
import { FaRegWindowClose, FaRegWindowMinimize, FaRegWindowMaximize } from "react-icons/fa";
import { TitleBarLayout } from "../AppLayout";

export const TitleBar = ({ className, ...props }: ComponentProps<'div'>): ReactElement => {
  function handleClick(event: string): void {
    window.api.titleBar(event)
  }
  return <TitleBarLayout className={cn("fixed w-full z-50 p-4", className)} {...props}>
    <div></div>
    <div className="flex justify-center items-center gap-3">
      <Button onClick={() => handleClick('minimize')}><FaRegWindowMinimize /></Button>
      <Button onClick={() => handleClick('maximize')}><FaRegWindowMaximize /></Button>
      <Button onClick={() => handleClick('close')}><FaRegWindowClose /></Button>
    </div>
  </TitleBarLayout>
}

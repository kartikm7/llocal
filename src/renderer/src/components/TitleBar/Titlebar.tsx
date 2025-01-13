import { Button } from "@renderer/ui/Button";
import { cn } from "@renderer/utils/utils";
import { ComponentProps, ReactElement } from "react";
import { FaRegWindowClose, FaRegWindowMinimize, FaRegWindowMaximize } from "react-icons/fa";
import { TitleBarLayout } from "../AppLayout";

export const TitleBar = ({ className, ...props }: ComponentProps<'div'>): ReactElement => {
  function handleClick(event: string): void {
    window.api.titleBar(event)
  }
  return <TitleBarLayout className={cn("z-50", className)} {...props}>
    <div className="absolute inset-x-0 top-0 h-4 draggable w-full "></div>
    <div className="absolute top-0 right-0 flex justify-center items-center gap-3 invert p-4">
      <Button onClick={() => handleClick('minimize')}><FaRegWindowMinimize /></Button>
      <Button onClick={() => handleClick('maximize')}><FaRegWindowMaximize /></Button>
      <Button onClick={() => handleClick('close')}><FaRegWindowClose /></Button>
    </div>
  </TitleBarLayout>
}

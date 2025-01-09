import { Button } from "@renderer/ui/Button";
import { cn } from "@renderer/utils/utils";
import { ComponentProps, ReactElement } from "react";
import { FaRegWindowClose, FaRegWindowMinimize, FaRegWindowMaximize } from "react-icons/fa";
import { TitleBarLayout } from "../AppLayout";

export const TitleBar = ({ className, ...props }: ComponentProps<'div'>): ReactElement => {
  return <TitleBarLayout className={cn("fixed w-full z-50 p-4", className)} {...props}>
    <div></div>
    <div className="flex justify-center items-center gap-3">
      <Button><FaRegWindowMinimize /></Button>
      <Button><FaRegWindowMaximize /></Button>
      <Button><FaRegWindowClose /></Button>
    </div>
  </TitleBarLayout>
}

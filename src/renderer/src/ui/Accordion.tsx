import { VariantProps, cva } from "class-variance-authority";
import React, { ComponentProps, useState } from "react";
import { Card } from "./Card";
import { cn } from "@renderer/utils/utils";
import { IoIosArrowDown } from "react-icons/io";

const AccordionVariants = cva('', {
  variants: {
    variant: {
      base: 'w-full p-2 rounded-xl mb-2 cursor-pointer opacity-50 hover:opacity-100 transition-all',
    }
  },
  defaultVariants: {
    variant: 'base'
  }
})
interface AccordionProps extends ComponentProps<'div'>, VariantProps<typeof AccordionVariants> {
  title: string,
  content: string,
  loading?: boolean,
  initialOpen?: boolean
}
export const Accordion = ({ title, content, loading = false, initialOpen = false, className, variant, ...props }: AccordionProps): React.ReactElement => {
  const [open, setOpen] = useState(initialOpen)
  return <Card
    className={cn(AccordionVariants({ variant, className }), loading && "cursor-default hover:opacity-50")}
    onClick={() => setOpen(pre => !pre)}
    {...props}>
    <h1 role="button" className="flex justify-between items-center" >
      <span className="text-xs flex justify-center items-center gap-2">{loading && <span className="relative flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white-400 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-white-500"></span>
      </span>}<span className={`${loading && "animation-pulse"}`}>{title}</span> </span>
      <span className={`transition-all ${open && 'rotate-180'} `}><IoIosArrowDown /></span>
    </h1>
    <div className={`transition-all duration-300 grid overflow-hidden ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
      <div className="overflow-hidden">
        {content}
      </div>
    </div>
  </Card >
}

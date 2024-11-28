import { ComponentProps } from "react";
import { BreadCrumb } from "./BreadCrumb";
import { cn } from "@renderer/utils/utils";
import { VariantProps, cva } from "class-variance-authority";

const ToolTipVariants = cva('hidden absolute group-hover:block transform z-10', {
  variants: {
    variant: {
      top: 'left-1/2 -translate-x-1/2 bottom-full mb-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      bottom: 'left-1/2 -translate-x-1/2 top-full mt-2'
    }
  },
  defaultVariants: {
    variant: 'top'
  }
})

interface ToolTip extends ComponentProps<'div'>, VariantProps<typeof ToolTipVariants> { tooltip: string }

export default function ToolTip({ tooltip, variant, className, children }: ToolTip): React.ReactElement {
  return <div className={cn('relative group w-fit', className)}>
    {children}
    <BreadCrumb className={cn(ToolTipVariants({ variant }))} variant='raw'><p className="w-fit">{tooltip}</p></BreadCrumb>
  </div>
}

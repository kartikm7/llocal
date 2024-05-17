import { Card } from "@renderer/ui/Card"
import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export const Messages = ({className, ...props}:ComponentProps<'div'>):React.ReactElement=>{
  return <div className={twMerge("flex flex-col gap-5 items-start w-3/6 mb-5 overflow-y-auto", className)} {...props}>
    <Card className="self-end bg-opacity-0 dark:bg-opacity-10"><h1 className="">What's lorem ipsum?</h1></Card>
    <Card>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim quo ea qui, totam, culpa impedit rem atque nostrum reprehenderit suscipit at nobis repellat asperiores quasi amet, sint molestias. Officia, at!</Card>
  </div>

}
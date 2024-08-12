import { BreadCrumb } from "@renderer/ui/BreadCrumb";
import { Card } from "@renderer/ui/Card";
import { cn } from "@renderer/utils/utils";
import React, { ComponentProps, useEffect, useState } from "react";

interface getVectorDb{
  path: string,
  fileName: string
}

export const KnowLedgeBase = ({className, ...props}:ComponentProps<'div'>):React.ReactElement => {
  const [knowledgeBase, setKnowledgeBase] = useState<getVectorDb[]>([])

  useEffect(()=>{
    async function getVectorDb():Promise<void>{
      const response = await window.api.getVectorDbList()
      setKnowledgeBase(response);
    }
    getVectorDb()
  },[])

  const map = new Map();
  map.set('pdf', <BreadCrumb className="text-red-400">PDF</BreadCrumb> )
  map.set('docx', <BreadCrumb className="text-blue-400">DOCX</BreadCrumb> )
  map.set('pptx', <BreadCrumb className="text-orange-400">PPTX</BreadCrumb> )
  map.set('txt', <BreadCrumb className="">TXT</BreadCrumb> )
  map.set('csv', <BreadCrumb className="text-green-400">CSV</BreadCrumb> )
  return <>
  <Card className={cn('space-y-2 overflow-scroll',className)} {...props}>
    {knowledgeBase.map((val, index)=> {
      const splits = val.fileName.split('.') // this splits the string at '.' and pushes the parts before and after to an array
      const extension = splits[splits.length-1] // because we know the characters after the final '.' will be the extension this works
      return <Card className="flex justify-between items-center gap-5" key={index}>
        <h1 className="">{val.fileName}</h1>
        {map.get(extension)}
      </Card>
    })}
  </Card>
  <p className="opacity-50 text-sm">To access the Knowledge Base, you can use the / forward slash at the beginning of your prompt </p>
  </>
}
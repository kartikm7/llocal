import { BreadCrumb } from "@renderer/ui/BreadCrumb";
import { Card } from "@renderer/ui/Card";
import { cn } from "@renderer/utils/utils";
import React, { ComponentProps, useEffect } from "react";
import { DeleteButton } from "../Sidebar/DeleteButton";
import { useAtom } from "jotai";
import { knowledgeBaseAtom } from "@renderer/store/mocks";
import { IoIosAddCircle } from 'react-icons/io'

// interface getVectorDb{
//   path: string,
//   fileName: string
// }

export const KnowLedgeBase = ({className, ...props}:ComponentProps<'div'>):React.ReactElement => {
  const [knowledgeBase, setKnowledgeBase] = useAtom(knowledgeBaseAtom)

  useEffect(()=>{
    async function getVectorDb():Promise<void>{
      const response = await window.api.getVectorDbList()
      setKnowledgeBase(response);
    }
    getVectorDb()
  },[knowledgeBase])

  /* god bless my dsa prep, that's the only reason I have been able to use a map here
    just so handy, since we can store a key value pair of Components! */
  const map = new Map();
  map.set('pdf', <BreadCrumb className="group-hover:fade line-clamp-1 transition-all text-red-400">PDF</BreadCrumb> )
  map.set('docx', <BreadCrumb className="group-hover:fade line-clamp-1 transition-all text-blue-400">DOCX</BreadCrumb> )
  map.set('pptx', <BreadCrumb className="group-hover:fade line-clamp-1 transition-all text-orange-400">PPTX</BreadCrumb> )
  map.set('txt', <BreadCrumb className="group-hover:fade line-clamp-1 transition-all ">TXT</BreadCrumb> )
  map.set('csv', <BreadCrumb className="group-hover:fade line-clamp-1 transition-all text-green-400">CSV</BreadCrumb> )
  return <>
  <Card className={cn('space-y-2 overflow-scroll',className)} {...props}>
    {knowledgeBase.length > 0 ? knowledgeBase.map((val, index)=> {
      const splits = val.fileName.split('.') // this splits the string at '.' and pushes the parts before and after to an array
      const extension = splits[splits.length-1] // because we know the characters after the final '.' will be the extension this works
      return <Card className="group relative flex justify-between items-center gap-5" key={index}>
        <DeleteButton type='knowledge' path={val.path} fileName={val.fileName} className='group-hover:flex hidden absolute z-40 right-5 top-1/2 transform -translate-y-1/2 my-auto' />
        <h1 className="group-hover:fade line-clamp-1 transition-all">{val.fileName}</h1>
        {map.get(extension)}
      </Card>
    }) : <div className="p-3 space-y-2">
      <h1  >It&apos;s quite empty in here <br /></h1>
      <h1 className="opacity-50 text-sm">You can add content to the knowledge base using the more button in the the chatbox <br />
      <span className="flex items-center gap-2">the more button looks like this : <IoIosAddCircle /> </span>
      </h1>
      </div>}
  </Card>
  <p className="opacity-50 text-sm">To access the Knowledge Base, you can use the / forward slash at the beginning of your prompt </p>
  </>
}
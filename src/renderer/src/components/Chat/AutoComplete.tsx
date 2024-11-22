import { fileContextAtom, knowledgeBaseAtom } from "@renderer/store/mocks"
import { BreadCrumb } from "@renderer/ui/BreadCrumb"
import { Card } from "@renderer/ui/Card"
import { cn } from "@renderer/utils/utils"
import { useAtom, useSetAtom } from "jotai"
import React, { ComponentProps, useEffect } from "react"
import { UseFormReset } from "react-hook-form"
// import { TbFileTypeDocx, TbFileTypePdf, TbFileTypePpt, TbFileTypeTxt } from "react-icons/tb";

interface getVectorDb {
  path: string,
  fileName: string
}

type FormFieldsType = {
  prompt?: string
}


interface AutoCompleteProps extends ComponentProps<'div'> {
  list: getVectorDb[]
  reset: UseFormReset<FormFieldsType>
}

export const AutoComplete = ({ className, list, reset, ...props }: AutoCompleteProps): React.ReactElement => {
  const map = new Map();
  map.set('pdf', <BreadCrumb className="text-red-400">PDF</BreadCrumb>)
  map.set('docx', <BreadCrumb className="text-blue-400">DOCX</BreadCrumb>)
  map.set('pptx', <BreadCrumb className="text-orange-400">PPTX</BreadCrumb>)
  map.set('txt', <BreadCrumb className="">TXT</BreadCrumb>)
  map.set('csv', <BreadCrumb className="text-green-400">CSV</BreadCrumb>)

  const [file, setFile] = useAtom(fileContextAtom)
  const setAutoCompleteList = useSetAtom(knowledgeBaseAtom)
  function handleClick(val: getVectorDb): void {
    setFile([...file, val])
    setAutoCompleteList(pre => pre.filter(db => db.fileName != val.fileName))
    reset()
  }

  useEffect(() => {
    // setAutoCompleteList(pre => pre.filter(db => file.some(val => val.path == db.path)))
    async function handleGetList(): Promise<void> {
      const list = await window.api.getVectorDbList();
      setAutoCompleteList(list)
    }

    if (file.length == 0) handleGetList()
  }, [file])

  console.log(file)
  return <Card className={cn(className, 'flex flex-col gap-1 w-fit h-32 max-w-72 p-4 overflow-x-visible overflow-y-scroll')} {...props}>
    {list.length > 0 && list.map((val, index) => {
      const splits = val.fileName.split('.');
      return <div key={index} className="flex justify-between items-center gap-2 opacity-75 hover:opacity-100 hover:scale-95 cursor-pointer transition-all">
        <h1 className="text-sm truncate" onClick={() => handleClick(val)}>{val.fileName}</h1>
        {map.get(splits[splits.length - 1])}
      </div>
    })}
  </Card>
}



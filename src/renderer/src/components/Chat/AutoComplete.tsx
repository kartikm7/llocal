import { autoCompleteAtom, fileContextAtom } from "@renderer/store/mocks"
import { Card } from "@renderer/ui/Card"
import { cn } from "@renderer/utils/utils"
import { useAtom, useSetAtom } from "jotai"
import { ComponentProps } from "react"
import { UseFormReset } from "react-hook-form"
import { TbFileTypeDocx, TbFileTypePdf, TbFileTypePpt, TbFileTypeTxt } from "react-icons/tb";

interface getVectorDb{
  path: string,
  fileName: string
}

type FormFieldsType = {
  prompt?: string
}


interface AutoCompleteProps extends ComponentProps<'div'>{
  list : getVectorDb[]
  reset: UseFormReset<FormFieldsType>
}

export const AutoComplete = ({className, list, reset,...props}:AutoCompleteProps):React.ReactElement => {
  const map = new Map();
  map.set('pdf', <TbFileTypePdf className="text-2xl flex" />)
  map.set('docx', <TbFileTypeDocx className="text-2xl" />)
  map.set('ppt', <TbFileTypePpt className="text-2xl" />)
  map.set('txt', <TbFileTypeTxt className="text-2xl" />)

  const [file, setFile] = useAtom(fileContextAtom)
  const setAutoCompleteList = useSetAtom(autoCompleteAtom)
  function handleClick(val:getVectorDb):void{
    setFile(val)
    setAutoCompleteList([])
    reset()
  }

  return <Card className={cn(className,'w-fit h-32 p-4 overflow-x-visible overflow-y-scroll')} {...props}>
    {!file.fileName && list.map((val, index)=>{
      const splits = val.fileName.split('.');
      return <div key={index} className="flex items-center gap-2 opacity-75 hover:opacity-100 hover:scale-95 cursor-pointer transition-all">
        {map.get(splits[splits.length-1])}
        <h1 className="text-sm truncate w-5/6"  onClick={()=>handleClick(val)}>{val.fileName}</h1>
      </div>
    })}
  </Card>
}
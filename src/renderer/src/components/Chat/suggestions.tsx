import { usePrompt } from "@renderer/hooks/usePrompt";
import { suggestionsAtom } from "@renderer/store/mocks";
import { Card } from "@renderer/ui/Card";
import { cn } from "@renderer/utils/utils";
import { useAtom } from "jotai";
import { ComponentProps } from "react";

export default function Suggestions({ className, ...props }: ComponentProps<'div'>): React.ReactElement {
  const [suggestions, setSuggestions] = useAtom(suggestionsAtom)
  const [isLoading, promptReq] = usePrompt()
  async function handleClick(prompt: string): Promise<void> {
    setSuggestions(pre => ({ ...pre, prompts: [] }))
    await promptReq(prompt)
  }
  return <div className={cn(className, 'space-y-1')} {...props}>
    {suggestions.prompts.length > 0 && suggestions.prompts.map((val, index) => <Card onClick={() => handleClick(val)} className={`w-fit bg-opacity-10 dark:bg-opacity-10 p-3 text-sm fadeInUp-animation opacity-75 ${isLoading ? "cursor-none" : "hover:opacity-100 hover:underline cursor-pointer"} transition-all`} key={index}>
      {val}
    </Card>)}
  </div >
}

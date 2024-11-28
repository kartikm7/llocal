import { useLocal } from "@renderer/hooks/useLocal";
import { suggestionsAtom } from "@renderer/store/mocks";
import { BreadCrumb } from "@renderer/ui/BreadCrumb";
import { Checkbox } from "@renderer/ui/Checkbox";
import { cn } from "@renderer/utils/utils";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { toast } from "sonner";

export default function Preferences({ className, ...props }: ComponentProps<'div'>): React.ReactElement {
  const suggestions = useAtomValue(suggestionsAtom)
  const { setShowSuggestion } = useLocal()
  // TODO: Handle multiple preferences
  function handleClick(): void {
    // this shit is so hard to read, because this is the toggle AAAAAAAH
    toast.info(!suggestions.show ? 'Suggestions have been turned on' : 'Suggestions have been turned off')
    setShowSuggestion(!suggestions.show)
  }
  return <div className={cn('', className)} {...props}>
    <BreadCrumb className="flex justify-center items-center gap-2" onClick={handleClick}>
      <Checkbox isExternalState={true} externalState={suggestions.show} className="text-sm" />
      Suggestions ( Experimental )
    </BreadCrumb>
  </div>
}

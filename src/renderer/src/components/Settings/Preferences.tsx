import { useLocal } from "@renderer/hooks/useLocal";
import { suggestionsAtom, transparencyModeAtom } from "@renderer/store/mocks";
import { BreadCrumb } from "@renderer/ui/BreadCrumb";
import { Checkbox } from "@renderer/ui/Checkbox";
import { cn } from "@renderer/utils/utils";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { toast } from "sonner";

export default function Preferences({ className, ...props }: ComponentProps<'div'>): React.ReactElement {
  // Defining the the hooks at the top of the function
  const suggestions = useAtomValue(suggestionsAtom)
  const transparencyMode = useAtomValue(transparencyModeAtom)
  const { setShowSuggestion, setTransparency } = useLocal()

  // TODO: Handle multiple preferences
  function handleClick(state: boolean, setState: (pref: boolean) => void, preference: string): void {
    // this shit is so hard to read, because this is the toggle AAAAAAAH
    toast.info(!state ? `${preference} have been turned on` : `${preference} have been turned off`)
    setState(!state)
  }
  return <div className={cn('', className)} {...props}>
    <BreadCrumb className="flex justify-center items-center gap-2" onClick={() => handleClick(suggestions.show, setShowSuggestion, 'Suggestions')}>
      <Checkbox isExternalState={true} externalState={suggestions.show} className="text-sm" />
      Suggestions ( Experimental )
    </BreadCrumb>
    <BreadCrumb className="flex justify-center items-center gap-2" onClick={() => handleClick(transparencyMode, setTransparency, 'Transparency Mode')}>
      <Checkbox isExternalState={true} externalState={transparencyMode} className="text-sm" />
      Transparency Mode
    </BreadCrumb>
  </div>
}

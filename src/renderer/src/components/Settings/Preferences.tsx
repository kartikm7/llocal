import { useLocal } from "@renderer/hooks/useLocal";
import { suggestionsAtom, transparencyModeAtom } from "@renderer/store/mocks";
import { BreadCrumb } from "@renderer/ui/BreadCrumb";
import { Checkbox } from "@renderer/ui/Checkbox";
import { cn, t } from "@renderer/utils/utils";
import { useAtomValue } from "jotai";
import { ComponentProps } from "react";
import { toast } from "sonner";

export default function Preferences({ className, ...props }: ComponentProps<'div'>): React.ReactElement {
  // Defining the the hooks at the top of the function
  const suggestions = useAtomValue(suggestionsAtom)
  const transparencyMode = useAtomValue(transparencyModeAtom)
  const { setShowSuggestion, setTransparency } = useLocal()

  // Handles multiple preferences
  function handleClick(state: boolean, setState: (pref: boolean) => void, preference: string): void {
    // this shit is so hard to read, because this is the toggle AAAAAAAH
    toast.info(!state ? t('preferenceOn', { preference }) : t('preferenceOff', { preference }))
    setState(!state)
  }
  return <div className={cn('flex gap-2', className)} {...props}>
    <BreadCrumb className="flex justify-center items-center gap-2" onClick={() => handleClick(suggestions.show, setShowSuggestion, 'Suggestions')}>
      <Checkbox isExternalState={true} externalState={suggestions.show} className="text-sm" />
      {t("Suggestions ( Experimental )")}
    </BreadCrumb>
    <BreadCrumb className="flex justify-center items-center gap-2" onClick={() => handleClick(transparencyMode, setTransparency, 'Transparency Mode')}>
      <Checkbox isExternalState={true} externalState={transparencyMode} className="text-sm" />
      {t("Transparency Mode")}
    </BreadCrumb>
  </div>
}

import { cn } from "@renderer/utils/utils";
import { ComponentProps, ReactElement } from "react";
import { MermaidWrapper } from "./Mermaid";

interface ArtifactsProps extends ComponentProps<'div'> {
  language: string,
  code: string
}
// this component is to handle all the code that is to be made runnable
// at the moment the planned support is only for Mermaid
export default function Artifacts({ className, language, code, ...props }: ArtifactsProps): ReactElement {
  const artifactSelector = (): ReactElement => {
    switch (language) {
      case "mermaid":
        return <MermaidWrapper code={code} />
      default:
        return <h1>Not suppported</h1>
    }
  }

  return (<div className={cn("overflow-x-scroll", className)} {...props}>
    {artifactSelector()}
  </div>)
}

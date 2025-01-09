import mermaid from "mermaid"
import { ReactNode, Component, ReactElement, ComponentProps } from "react"
import { toast } from "sonner"
import { BreadCrumb } from "./BreadCrumb"
import { domToPng } from 'modern-screenshot'
import { MdOutlineFileDownload } from "react-icons/md"

mermaid.initialize({
  startOnLoad: true,
  theme: "base"
  // securityLevel: "loose"
}
)

export class Mermaid extends Component<{ code: string }> {
  componentDidMount(): void {
    mermaid.contentLoaded()
  }
  componentDidUpdate(): void {
    document.getElementById("mermaid-chart")?.removeAttribute("data-processed")
    mermaid.contentLoaded()
  }
  render(): ReactNode {
    return <div id="mermaid-chart" className="mermaid p-8 !w-[500px]  md:!w-[1500px]">{this.props.code}</div>
  }
}

interface MermaidInterface extends ComponentProps<'div'> { code: string }

export const MermaidWrapper = ({ code }: MermaidInterface): ReactElement => {

  async function handleClick(): Promise<void> {
    try {
      domToPng((document.getElementById("mermaid-screenshot")) as HTMLElement).then(url => {
        const link = document.getElementById('hiddenDownloadButton') as HTMLAnchorElement
        link.download = 'screenshot.png'
        link.href = url
        link.click()
      })
    } catch (error) {
      toast.error(String(error))
    }
  }

  return <div className="relative">
    <BreadCrumb className="absolute flex justify-center items-center my-1" onClick={handleClick}>Download</BreadCrumb>
    <div id="mermaid-screenshot" className="">
      <Mermaid code={code} />
    </div>
    <a id="hiddenDownloadButton" className="hidden"></a>
  </div >
}

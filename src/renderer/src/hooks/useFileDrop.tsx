import { fileContextAtom, fileDropAtom, imageAttatchmentAtom } from "@renderer/store/mocks";
import { t } from "@renderer/utils/utils";
import { useSetAtom } from "jotai";
import { DragEvent } from "react";
import { toast } from "sonner";

export function useFileDrop() {
  const setFile = useSetAtom(fileContextAtom);
  const setFileDrop = useSetAtom(fileDropAtom)
  const setImageAttachment = useSetAtom(imageAttatchmentAtom)

  async function handleDrop(e: DragEvent) {
    // need to ensure the page does not reload
    e.stopPropagation()
    e.preventDefault()
    let toastId: string | number = ""
    e.dataTransfer.dropEffect = "copy"
    const file = e.dataTransfer && e.dataTransfer.files[0]
    try {
      if (!file) throw new Error("Something went wrong, while loading file")
      const splits = (file.path).split("/")
      const fileName = splits[splits.length - 1]
      // if it's image then we gucci
      if (file.type.includes("image")) {
        handleImage(file)
      } else if (checkFileExtensions(fileName)) {
        toastId = toast.loading(t(`Adding to the knowledge base`))
        const response = await window.api.addKnowledge(file.path)
        setFile(pre => Array.isArray(pre) ? [response, ...pre] : [response])
        toast.success(t('fileAdded', { fileName: response.fileName }), { id: toastId })
      } else {
        toast.info(t("Only pdf, pptx, csv, txt, docx and image files are supported!"))
      }
    } catch (error) {
      const splits = String(error).split(":")
      toast.error(`${splits[splits.length - 1]}`, { id: toastId })
    } finally {
      // require to set the drop state back to false to disable the styles
      setFileDrop(false)
    }
  }

  /**
   * This is used to filter everything other than image files
   * @param fileType ()
   * @returns boolean
   */
  function checkFileExtensions(fileType: string): boolean {
    const extensions = ["pptx", "csv", "txt", "docx", "pdf"]
    return extensions.some((val) => fileType.includes(val))
  }

  function handleImage(file: File) {
    const reader = new FileReader()
    // Convert the file to base64 text
    reader.readAsDataURL(file)
    // on reader load somthing...
    reader.onload = (): void => {
      // Make a fileInfo Object
      const base64 = reader.result?.toString().split('base64,')
      if (base64) {
        setImageAttachment(`${base64[1]}`)
      }
      toast.success(t('The image has been processed! Please make sure a vision model is selected'))
    }
  }



  return { handleDrop }
}


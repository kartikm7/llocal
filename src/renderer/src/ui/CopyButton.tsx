import { ComponentProps, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { LuCopy, LuCopyCheck } from 'react-icons/lu'
import { renderToStaticMarkup } from 'react-dom/server'
import TurndownService from 'turndown'
import { gfm } from "@guyplusplus/turndown-plugin-gfm"
import { cn } from '@renderer/utils/utils'

interface CopyButtonProps extends ComponentProps<'p'> {
  text?: string | string[]
  onCopy?: (() => void) | undefined
  isTable?: boolean
}

export const CopyButton = ({ text, className, onCopy = undefined, isTable = false, children }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  function handleOnCopy(): void {
    // handling user given function, if it exists
    if (onCopy) onCopy()
    setCopied(true)
    // setting it back to false, so the icon goes back to the original state
    setTimeout(() => setCopied(false), 1500)
  }

  let convertChildrenToString = ""
  if (!text) {
    // this is incredible, I saved so much time it's so cool we can render a static markup string
    convertChildrenToString = renderToStaticMarkup(children)
    if (isTable) convertChildrenToString = `<table>\n${convertChildrenToString}\n</table>`
    const turnDownService = new TurndownService()
    gfm(turnDownService)
    convertChildrenToString = turnDownService.turndown(convertChildrenToString)
  }


  return (
    <CopyToClipboard
      text={text ?? convertChildrenToString}
      onCopy={handleOnCopy}
      className={cn('cursor-pointer opacity-50 hover:opacity-100 transition-all', className)}
    >
      <p className='flex justify-center items-center cursor-pointer opacity-75 hover:opacity-100'>
        {copied ? <LuCopyCheck className='text-green-400' /> : <LuCopy />}
      </p>
    </CopyToClipboard>
  )
}

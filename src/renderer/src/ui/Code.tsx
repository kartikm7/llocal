import React from 'react'
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { toast } from 'sonner'
import { FaClipboard } from 'react-icons/fa6'
import { Separator } from './Separator'

export const Code = ({
  children,
  language,
  ...props
}: SyntaxHighlighterProps): React.ReactElement => {
  return (
    // match[1]
    <div className='max-w-xl md:max-w-2xl '>
      <div className='flex justify-between p-1 items-center rounded-t-md bg-foreground dark:bg-background dark:bg-opacity-75'>
        <p className='opacity-75'>{language}</p>
        <CopyToClipboard
          text={children}
          onCopy={() => toast.success(`${language} code has been copied to clipboard!`)}
        >
          <p className='flex justify-center items-center cursor-pointer opacity-75 hover:opacity-100'>
            <FaClipboard />
          </p>
        </CopyToClipboard>
      </div>
      <Separator />
      <SyntaxHighlighter {...props} PreTag="div" language={language} style={atomOneDarkReasonable}>
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

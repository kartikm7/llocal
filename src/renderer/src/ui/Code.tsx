import React, { useState } from 'react'
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { toast } from 'sonner'
import { FaClipboard } from 'react-icons/fa6'
import { Separator } from './Separator'
import { HiMiniSparkles } from 'react-icons/hi2'
import Artifacts from './Artifacts'
import { t } from '@renderer/utils/utils'
import { CopyButton } from './CopyButton'

// list of supportedArtifacts
const supportedArtifacts = ['mermaid']

export const Code = ({
  children,
  language,
  ...props
}: SyntaxHighlighterProps): React.ReactElement => {
  const [isArtifact, setArtifact] = useState(false)
  return (
    // match[1]
    <div className='max-w-full max-h-full'>
      <div className='flex justify-between p-1 items-center rounded-t-md bg-foreground dark:bg-background dark:bg-opacity-75'>
        <p className='opacity-75'>{language}</p>
        <div className='flex justify-center items-center gap-3'>
          <CopyButton text={children} />
          {supportedArtifacts.includes(language ?? '') && < HiMiniSparkles onClick={() => setArtifact(pre => !pre)} className='cursor-pointer opacity-75 hover:opacity-100' />}
        </div>
      </div>
      <Separator />
      {
        isArtifact ? <Artifacts code={String(children)} language={language ?? ''} /> : <SyntaxHighlighter {...props} PreTag="div" language={language} style={atomOneDarkReasonable}>
          {children}
        </SyntaxHighlighter>
      }
    </div >
  )
}

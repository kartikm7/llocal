import React, { useState } from 'react'
import SyntaxHighlighter, { SyntaxHighlighterProps } from 'react-syntax-highlighter'
import { Separator } from './Separator'
import { HiMiniSparkles } from 'react-icons/hi2'
import Artifacts from './Artifacts'
import { CopyButton } from './CopyButton'
import { Card } from './Card'
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

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
    <Card className='max-w-full max-h-full p-2 my-2'>
      <div className='flex justify-between p-1 items-center rounded-t-md '>
        <p className='opacity-50 text-xs'>{language}</p>
        <div className='flex justify-center items-center gap-3'>
          <CopyButton text={children} />
          {supportedArtifacts.includes(language ?? '') && < HiMiniSparkles onClick={() => setArtifact(pre => !pre)} className='cursor-pointer opacity-75 hover:opacity-100' />}
        </div>
      </div>
      <Separator className='h-[1px]' />
      {
        isArtifact ? <Artifacts code={String(children)} language={language ?? ''} /> : <SyntaxHighlighter customStyle={{ background: 0 }} PreTag="div" language={language} style={atomOneDarkReasonable} >
          {children}
        </SyntaxHighlighter>
      }
    </Card >
  )
}

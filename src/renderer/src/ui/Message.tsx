import { ComponentProps, useRef } from "react";
import { Card } from "./Card";
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Code } from "./Code";
import reactNodeToString from 'react-node-to-string'
import { Accordion } from "./Accordion";
import { customTagValidator, formatCustomBlock } from "@renderer/utils/utils";

interface Message extends ComponentProps<'div'> {
  message: string,
  stream?: boolean,
}

export const AiMessage = ({ message, stream, ...props }: Message): React.ReactElement => {
  // TODO: Expand this to support multiple custom tags, at the moment it only supports <think></think>
  //
  // this is crucial, since during streaming we need to see the custom tag irrespective.
  // the validation, invalidate's it which is technically correct, but UX wise incorrect.
  let validation = true // optimistic validation
  console.log("stream", stream)
  if (!stream) {
    validation = customTagValidator(message, 'think')
    if (validation) message = formatCustomBlock(message, 'think')
  }

  console.log(message)

  return <Card {...props}>
    <Markdown
      className="markdown"
      rehypePlugins={validation ? [rehypeHighlight, rehypeRaw] : [rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
      components={{
        // @ts-ignore because
        think: (data) => {
          return data.children?.constructor == Array ? <Accordion title={stream ? "Thinking" : "Chain of thought"} content={data.children} loading={stream} initialOpen={stream} /> : <></>
        },
        a: (props) => {
          return (
            <a
              href={props.href}
              className="bg-foreground bg-opacity-20 opacity-70 px-1 hover:opacity-100 hover:underline transition-all"
              target="_blank"
              rel="noreferrer"
            >
              {props.children}
            </a>
          )
        },
        code(props) {
          const myRef = useRef<SyntaxHighlighter>(null)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, className, node, ...rest } = props
          // console.log(children)

          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <Code language={match[1]} ref={myRef}>
              {reactNodeToString(children).trim().replace(/\n$/, '')}
            </Code>
          ) : (
            <code {...rest} className={className + " text-wrap"}>
              {children}
            </code>
          )
        }
      }}
    >
      {message}
    </Markdown>
  </Card>

}

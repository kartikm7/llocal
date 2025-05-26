import { ComponentProps, useRef } from "react";
import { Card } from "./Card";
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Code } from "./Code";
import { Accordion } from "./Accordion";
import { customTagValidator, formatCustomBlock } from "@renderer/utils/utils";
import { BreadCrumb } from "./BreadCrumb";
import { BsGlobeCentralSouthAsia } from "react-icons/bs";
import "highlight.js/styles/github.css";

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
  if (!stream) {
    validation = customTagValidator(message, 'think')
    if (validation) message = formatCustomBlock(message, 'think')
  }

  return <Card {...props}>
    <Markdown
      className="markdown"
      rehypePlugins={validation ? [rehypeRaw] : []}
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
              className=""
              target="_blank"
              rel="noreferrer"
            >

              <BreadCrumb className=" w-2/6 max-w-fit truncate inline-block">
                <BsGlobeCentralSouthAsia className="inline-flex mr-1" />
                {props.children}
              </BreadCrumb>
            </a>
          )
        },
        code(props) {
          const myRef = useRef<SyntaxHighlighter>(null)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, className, node, ...rest } = props
          console.log(String(children).replace(/\n$/, ''))

          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <Code language={match[1]} ref={myRef}>
              {String(children).replace(/\n$/, '')}
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

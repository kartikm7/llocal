import { ComponentProps, useRef } from "react";
import { Card } from "./Card";
import Markdown from 'react-markdown'
// import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Code } from "./Code";
import reactNodeToString from 'react-node-to-string'

interface Message extends ComponentProps<'div'> {
  message: string
}

export const AiMessage = ({ key, message }: Message): React.ReactElement => {
  return <Card key={key}>
    <Markdown
      className="markdown"
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
      components={{
        // @ts-ignore because
        // think: (d) => {
        //   return <div>{d.children}</div>
        // },
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

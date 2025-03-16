import { chatAtom, darkModeAtom, experimentalSearchAtom, imageAttatchmentAtom, streamingAtom } from "@renderer/store/mocks"
import { Card } from "@renderer/ui/Card"
import { AiMessage } from "@renderer/ui/Message"
import { cn } from "@renderer/utils/utils"
import { useAtom, useAtomValue } from "jotai"
import { ComponentProps } from "react"
import Skeleton from "react-loading-skeleton"
import Suggestions from "../suggestions"

export const StreamingMessage = ({ className, ...props }: ComponentProps<'div'>): React.ReactElement => {

  const chat = useAtomValue(chatAtom)
  const [stream] = useAtom(streamingAtom)
  const darkMode = useAtomValue(darkModeAtom)
  const imageAttachment = useAtomValue(imageAttatchmentAtom)
  const experimentalSearch = useAtomValue(experimentalSearchAtom)
  return <div className={cn("", className)} {...props}>
    {stream && (
      <div className="flex flex-col gap-2">
        <AiMessage message={stream} stream={!!stream} />
      </div>
    )}
    {chat.length > 0 &&
      chat[chat.length - 1].role == 'user' &&
      !stream &&
      (experimentalSearch || imageAttachment) && (
        <Card className="w-4/5">
          <Skeleton
            className="opacity-50"
            baseColor={darkMode ? '#FFFFFF' : '#202020'}
            highlightColor={darkMode ? '#bfbfbf' : ' #b3b3b3'}
            borderRadius={5}
            count={4}
          />
        </Card>
      )}
    {!stream && <Suggestions />}

  </div>
}

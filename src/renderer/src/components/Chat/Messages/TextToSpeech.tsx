import { Button, ButtonProps } from "@renderer/ui/Button"
import { useEffect, useState } from "react";
import { LuLoader2, LuStopCircle, LuVolume2 } from "react-icons/lu";
import { toast } from "sonner";

interface TextToSpeechProps extends ButtonProps {
  text: string
}

/*  TODO:: The biggest problem with this component is that when we pause, we actually clear the whole state meaning we need to regenerate the
 *  wave buffer. ISN'T THAT INFURIATING. Haven't been able to figure it out yet. The issue, is that when we don't clear the audio state it
 *  some how persists across multiple messages which makes no sense since it should be local to the component could be something to do with id I think,
 *  since the reference to all audios should not be the same*/
export const TextToSpeech = ({ text, key }: TextToSpeechProps): React.ReactElement => {
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [isLoading, setLoading] = useState(false)
  const [isPlaying, setPlaying] = useState(false)

  const getAudioUrl = async (text: string) => {
    const buffer = await window.api.textToSpeech(text)
    const blob = new Blob([buffer], { type: "audio/wav" });
    return window.URL.createObjectURL(blob);
  }

  async function handleAudio() {
    setLoading(true)
    try {
      const url = await getAudioUrl(text)
      setAudio(new Audio(url))
      setPlaying(true)
    } catch (error) {
      toast.error(String(error))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (audio) {
      if (isPlaying) audio.play()
      else {
        audio.pause()
      }
      audio.onended = () => {
        setPlaying(false)
      }

    } else if (!audio && isPlaying) {
      handleAudio()
    }
    return () => {
      if (audio) {
        audio.pause()
        audio.remove()
        setAudio(undefined)
      }
    }
  }, [isPlaying, audio])

  return (
    <>
      {isLoading ? <Button variant="icon" >
        <LuLoader2 className="animate-spin" />
      </Button> :
        <Button variant="icon" onClick={() => setPlaying(pre => !pre)}>
          {isPlaying ? <LuStopCircle /> : <LuVolume2 />}
        </Button>
      }
    </>
  )
}

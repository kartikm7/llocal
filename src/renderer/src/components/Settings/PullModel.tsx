import { useLocal } from '@renderer/hooks/useLocal'
import { Card } from '@renderer/ui/Card'
import { IconButton } from '@renderer/ui/IconButton'
import { Input } from '@renderer/ui/Input'
import { ollama } from '@renderer/utils/ollama'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ComponentProps, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PiMagnifyingGlassFill } from 'react-icons/pi'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

type FormFields = {
  model?: string
}

export const PullModel = ({ className, ...props }: ComponentProps<'form'>): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<FormFields>()
  const [isLoading, setLoading] = useState(false)
  const breadcrumbs = ['gemma:2b', 'llama3', 'phi3']
  const [, setSelectedBreadcrumb] = useState('')
  const [percentage, setPercentage] = useState(0)
  const { setModelChoice } = useLocal()

  useEffect(() => {
    if (percentage != 0 && percentage % 5 == 0) {
      toast.info(`${percentage}% has been pulled`)
    }
  }, [percentage])

  function handleClick(choice: string): void {
    setSelectedBreadcrumb(choice)
  }

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      setLoading(true)
      let currentDigestDone = false
      const response = await ollama.pull({ model: `${data.model}`, stream: true })
      toast.info(
        'Depending on your model of choice and internet connection, this may take sometime! Do not leave the settings page until 100% has been reached, you will be notified of every 5% that is completed!'
      )
      setLoading(false)
      for await (const part of response) {
        if (part.digest) {
          let percent = 0
          if (part.completed && part.total) {
            percent = Math.round((part.completed / part.total) * 100)
            setPercentage((preValue) => {
              if (preValue != percent) return percent
              return preValue
            })
          }
          if (percent === 100 && !currentDigestDone) {
            toast.success(`${data.model} has been succesfully pulled!`) // Output to a new line
            currentDigestDone = true
          }
        }
      }
      setModelChoice(`${data.model}`)
    } catch (error) {
      toast.error(`${error}`)
      setLoading(false)
    }

    reset()
  }
  return (
    <div className='flex flex-col gap-2 justify-center'>
      <h1 className="font-thin">Pull a new model :</h1>
      <form
        onSubmit={handleSubmit(onSubmit)} // don't quite understand the type error here
        className={twMerge('relative h-full', className)}
        {...props}
      >
        <Input
          name="model"
          register={register}
          disabled={isLoading}
          // value={selectedBreadcrumb}
          className="h-auto w-96"
          placeholder="Not sure? check the options below!"
        />
        <IconButton
          type="submit"
          disabled={isLoading}
          className="text-2xl absolute right-5 top-1/2 transform -translate-y-1/2"
        >
          <PiMagnifyingGlassFill />
        </IconButton>
      </form>
      <div className="flex gap-2">
        {breadcrumbs.map((val, index) => {
          return (
            <CopyToClipboard text={val} onCopy={()=> toast.success(`${val} copied to clipboard!`)} key={index}>
              <Card
                onClick={() => handleClick(val)}
                className="w-fit text-xs p-2 rounded-xl cursor-pointer opacity-50 hover:opacity-100 transition-all"
              >
                <p>{val}</p>
              </Card>
            </CopyToClipboard>
          )
        })}
        <Card
          onClick={() => window.open('https://ollama.com/library', '_blank')}
          className="w-fit text-xs p-2 rounded-xl cursor-pointer opacity-50 hover:opacity-100 transition-all"
        >
          Check <span className="underline">Ollama.ai</span> for more!
        </Card>
      </div>
    </div>
  )
}

import { Card } from '@renderer/ui/Card'
import { Button } from '@renderer/ui/Button'
import { Input } from '@renderer/ui/Input'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ComponentProps, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { PiMagnifyingGlassFill } from 'react-icons/pi'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { useOllama } from '@renderer/hooks/useOllama'

type FormFields = {
  model?: string
}

export const PullModel = ({ className, ...props }: ComponentProps<'form'>): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<FormFields>()
  const [isLoading, setLoading] = useState(false)
  const breadcrumbs = ['gemma:2b', 'llama3', 'phi3']
  const [, setSelectedBreadcrumb] = useState('')
  const {pullModel} = useOllama()

  function handleClick(choice: string): void {
    setSelectedBreadcrumb(choice)
  }

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    reset()
    setLoading(true)
    await pullModel(data.model)
    setLoading(false)
  }
  return (
    <div className="flex flex-col gap-2 justify-center">
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
        <Button
          type="submit"
          disabled={isLoading}
          className={`text-2xl absolute right-5 top-1/2 transform -translate-y-1/2 ${isLoading && 'hover:scale-100'}`}
        >
          <PiMagnifyingGlassFill />
        </Button>
      </form>
      <div className="flex gap-2">
        {breadcrumbs.map((val, index) => {
          return (
            <CopyToClipboard
              text={val}
              onCopy={() => toast.success(`${val} copied to clipboard!`)}
              key={index}
            >
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
          onClick={() => window.open('https://llocal.in/guide', '_blank')}
          className="w-fit text-xs p-2 rounded-xl cursor-pointer opacity-50 hover:opacity-100 transition-all"
        >
          Check <span className="underline">LLocal.in</span> for more!
        </Card>
      </div>
    </div>
  )
}

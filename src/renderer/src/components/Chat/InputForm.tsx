import { IconButton } from '@renderer/ui/IconButton'
import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import { SubmitHandler, useForm } from 'react-hook-form'
import { usePrompt } from '@renderer/hooks/usePrompt'
import { TextArea } from '@renderer/ui/TextArea'

type FormFields = {
  prompt?: string
}

export const InputForm = ({ className, ...props }: ComponentProps<'form'>): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<FormFields>()
  const [isLoading, promptReq] = usePrompt()
  function handleKeyDown(event : React.KeyboardEvent<HTMLTextAreaElement>):void{
    if(event.key === 'Enter'){
      handleSubmit(onSubmit)()
    }
  }
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    reset()
    await promptReq(data.prompt || '')
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge('relative w-3/6 h-12', className)}
      {...props}
    >
      <TextArea
        name="prompt"
        register={register}
        disabled={isLoading}
        onKeyDown={handleKeyDown}
        className="h-full w-full pr-8"
        placeholder="Enter your prompt"
      />
      <IconButton
        type="submit"
        disabled={isLoading}
        className="text-2xl absolute right-2 top-1/2 transform -translate-y-1/2"
      >
        <PiPaperPlaneRightFill />
      </IconButton>
    </form>
  )
}

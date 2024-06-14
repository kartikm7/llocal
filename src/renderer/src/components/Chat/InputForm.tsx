import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { PiPaperPlaneRightFill } from 'react-icons/pi'
import { SubmitHandler, useForm } from 'react-hook-form'
import { usePrompt } from '@renderer/hooks/usePrompt'
import { TextArea } from '@renderer/ui/TextArea'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/ui/Button'
import { MoreButton } from './MoreButton'

// Ensuring there is atleast one valid character, and no whitespaces this helps eradicate the white space as a message edge case
const FormFieldsSchema = z.object({
  prompt: z.string().trim().min(1)
})

// defining the form type as usual
type FormFieldsType = {
  prompt?: string
}

export const InputForm = ({ className, ...props }: ComponentProps<'form'>): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<FormFieldsType>({
    resolver: zodResolver(FormFieldsSchema)
  })
  const [isLoading, promptReq] = usePrompt()

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(onSubmit)()
    }
  }
  const onSubmit: SubmitHandler<FormFieldsType> = async (data) => {
    reset()
    await promptReq(data.prompt || '')
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={twMerge(`relative w-3/6 h-12`, className)}
      {...props}
    >
      <TextArea
        name="prompt"
        register={register}
        disabled={isLoading}
        onKeyDown={handleKeyDown}
        className={`h-full w-full pl-10 pr-8`}
        placeholder="Enter your prompt"
      />
      <MoreButton  className='text-2xl absolute left-2 top-1/2 transform -translate-y-1/2'/>
      <Button
        type="submit"
        variant={'icon'}
        disabled={isLoading}
        className="text-2xl absolute right-2 top-1/2 transform -translate-y-1/2"
      >
        <PiPaperPlaneRightFill />
      </Button>
    </form>
  )
}

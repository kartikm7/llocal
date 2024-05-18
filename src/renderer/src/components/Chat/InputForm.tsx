import { IconButton } from '@renderer/ui/IconButton'
import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { PiPaperPlaneRightFill } from "react-icons/pi";
import { Input } from '@renderer/ui/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { usePrompt } from '@renderer/hooks/usePrompt';

type FormFields = {
  prompt?: string;
}

export const InputForm = ({ className, ...props }: ComponentProps<'form'>): React.ReactElement => {
  const {register, handleSubmit, reset} = useForm<FormFields>()
  const onSubmit:SubmitHandler<FormFields> = async(data)=>{
    const [isLoading] = await usePrompt(data.prompt || '')    
    console.log(data.prompt);
    reset();
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={twMerge('relative w-3/6 h-12', className)} {...props}>
      <Input name='prompt' register={register} className='h-full w-full' placeholder='Enter your prompt'  />
      <IconButton type='submit' className='text-2xl absolute right-2 top-1/2 transform -translate-y-1/2'><PiPaperPlaneRightFill /></IconButton>
    </form>
  )
}

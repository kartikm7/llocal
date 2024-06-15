import { cn } from '@renderer/utils/utils'
import React, { ComponentProps, useState } from 'react'
import { LuCheckCircle2, LuCircle } from 'react-icons/lu'

interface CheckBoxProps extends ComponentProps<'div'> {
  isExternalState: boolean
  externalState?: boolean
}

export const Checkbox = ({
  className,
  isExternalState = false,
  externalState,
  ...props
}: CheckBoxProps): React.ReactElement => {
  const [checked, setChecked] = useState(false)

  function handleClick(): void {
    if (!isExternalState) {
      setChecked((pre) => !pre)
    }
  }
  return (
    <div onClick={handleClick} className={cn('text-2xl', className)} {...props}>
      {(isExternalState ? externalState : checked) ? (
        <LuCheckCircle2 className="transition-all" />
      ) : (
        <LuCircle className=" transition-all" />
      )}
    </div>
  )
}

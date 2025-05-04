import { t } from "@renderer/utils/utils";
import React, { ComponentProps, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const GetVersion = ({ className, ...props }: ComponentProps<'h1'>): React.ReactElement => {
  const [version, setVersion] = useState('')
  useEffect(() => {
    async function ipc(): Promise<void> {
      const response = await window.api.checkVersion()
      setVersion(response)
    }
    ipc()
  }, [])
  return <h1 className={twMerge("font-light", className)} {...props}>{t("LLocal version: ") + version}</h1>
}

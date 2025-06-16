import { useDb } from "@renderer/hooks/useDb";
import { Button, ButtonProps } from "@renderer/ui/Button"
import { LuGitBranchPlus } from "react-icons/lu";
import { toast } from "sonner";
interface BranchProps extends ButtonProps {
  index: number
}
export const Branch = ({ index, ...props }: BranchProps) => {
  const { getChat, addChat } = useDb()
  async function handleClick() {
    let chat = await getChat()
    chat = chat.slice(0, index + 1)
    await addChat(chat, true)
    toast.success(`Created a new branch from that message!`)
  }

  return (
    <Button onClick={handleClick} variant="icon" {...props}>
      <LuGitBranchPlus />
    </Button>
  )
}

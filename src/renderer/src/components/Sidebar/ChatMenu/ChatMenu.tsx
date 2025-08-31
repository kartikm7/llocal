import { Menu } from '@renderer/ui/Menu'
import { Modal } from '@renderer/ui/Modal';
import { cn } from '@renderer/utils/utils';
import { ComponentProps, useState } from 'react'
import { MdDeleteForever } from 'react-icons/md';
import { PiDotsThreeCircle } from "react-icons/pi";
import { LuInfo } from "react-icons/lu";
import { Button } from '@renderer/ui/Button';
import { useDb } from '@renderer/hooks/useDb';

interface ChatMenuProps extends ComponentProps<'div'> {
  date: string
}

export const ChatMenu = ({ className, date, ...props }: ChatMenuProps) => {
  const [open, setOpen] = useState(false)
  return <div>
    <div className={cn(`${open ? "block" : "hidden"} group-hover:block`, className)} {...props}>
      <Menu.Root onOpenChange={val => {
        // TODO: this is a bandaid fix, the css breaks intermittenly because when we switch from block -> hidden there's a 50-80ms ish
        // delay where because the Trigger itself is not any more in the DOM there is no anchor for the Menu causing it to tweak and absolutely position
        setTimeout(() => {
          setOpen(val)
        }, 150)
      }} modal={false}>
        <Menu.Trigger className="text-center h-full">
          <PiDotsThreeCircle className='text-2xl p-0' />
        </Menu.Trigger>
        <Menu.Content className={`z-30 h-fit w-fit`}>

          <DeleteModal date={date}>
            <Menu.Item onSelect={(e) => e.preventDefault()} className='flex items-center'>
              <MdDeleteForever className='text-2xl' />
              Delete
            </Menu.Item>
          </DeleteModal>
        </Menu.Content>
      </Menu.Root>
    </div>
  </div>
}

interface ChatListModalProps extends ChatMenuProps {
  open?: boolean
}

const DeleteModal = ({ className, date, children, ...props }: ChatListModalProps) => {
  const { deleteChat } = useDb()
  async function handleDelete(date: string) {
    await deleteChat(date)
  }
  return <Modal.Root  {...props}>
    <Modal.Overlay />
    <Modal.Trigger>{children}</Modal.Trigger>
    <Modal.Content className='gap-4'>
      <Modal.Header className='flex items-center text-center self-center gap-2 font-bold mb-2 text-md'>
        <LuInfo className='text-2xl' /> Are you sure?
      </Modal.Header>
      <Modal.Description className='w-72'>All your data is llocaly saved, once you delete this chat is gone forever!</Modal.Description>
      <div className='flex gap-2 justify-end mt-2'>
        <Modal.CancelTrigger>
          <Button variant='secondary' >Cancel</Button>
        </Modal.CancelTrigger>
        <Modal.AcceptTrigger callbackFn={() => { handleDelete(date) }}>
          <Button variant='primary' className='bg-red-950 dark:bg-red-500'>Delete</Button>
        </Modal.AcceptTrigger>
      </div>
    </Modal.Content>
  </Modal.Root>
}

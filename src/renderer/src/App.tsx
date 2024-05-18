import { Chat, RootLayout, Sidebar } from './components/AppLayout'
import BackgroundImage from './assets/themes/galaxia.svg'
import { InputForm } from './components/Chat/InputForm'
import { Messages } from './components/Chat/Messages'
import { ChatList } from './components/Sidebar/ChatList'
import { NewChat } from './components/Sidebar/NewChat'
import { Separator } from './ui/Separator'
import { CommandCentre } from './components/Sidebar/CommandCentre'

function App(): JSX.Element {

  return (
    <RootLayout
      className="font-poppins dark dark:bg-background dark:text-foreground w-full bg-cover h-screen"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <Sidebar className="bg-foreground bg-opacity-20 dark:bg-background dark:bg-opacity-20 backdrop-blur-lg flex flex-col gap-5">
        <NewChat />
        <Separator />
        <h1 className=''>Your chats</h1>
        <div className='h-3/4 overflow-y-auto'>
        <ChatList />
        </div>
        <CommandCentre className=''/>
      </Sidebar>
      <Chat className="flex flex-col justify-between items-center">
        <Messages className="" />
        <InputForm className="justify-self-end" />
      </Chat>
    </RootLayout>
  )
}

export default App

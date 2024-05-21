import { Chat, RootLayout, Settings, Sidebar } from './components/AppLayout'
import { InputForm } from './components/Chat/InputForm'
import { Messages } from './components/Chat/Messages'
import { ChatList } from './components/Sidebar/ChatList'
import { NewChat } from './components/Sidebar/NewChat'
import { Separator } from './ui/Separator'
import { CommandCentre } from './components/Sidebar/CommandCentre'
import { BackgroundSelector } from './components/Settings/BackgroundSelector'
import { useAtom } from 'jotai'
import { backgroundImageAtom, darkModeAtom } from './store/mocks'
import { ModeSelector } from './components/Settings/ModeSelector'
import { Toaster } from 'sonner'

function App(): JSX.Element {
  const [backgroundImage] = useAtom(backgroundImageAtom)
  // Ensuring the state update according to preference
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)
  const mode = localStorage.getItem('darkMode') === 'false' ? false : true
  setDarkMode(mode ?? true)
  return (
    <RootLayout
      className={`${darkMode && 'dark'} bg-[#DDDDDD] font-poppins scrollbar scrollbar-thumb-thin dark:bg-[#2c2c2c] dark:text-foreground w-full bg-cover h-screen`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Toaster />
      <Settings className="flex flex-col justify-between items-center">
        <h1 className="mt-10 text-4xl">Settings</h1>
        <div className="flex flex-col gap-5">
          <BackgroundSelector />
          <ModeSelector />
        </div>
        <div></div>
      </Settings>
      <Sidebar className="bg-foreground bg-opacity-20 dark:bg-background dark:bg-opacity-20 backdrop-blur-lg flex flex-col gap-5">
        <NewChat />
        <Separator />
        <h1 className="">Your chats</h1>
        <div className="h-3/4 overflow-y-auto">
          <ChatList />
        </div>
        <CommandCentre className="" />
      </Sidebar>
      <Chat className="flex flex-col justify-between items-center">
        <Messages className="" />
        <InputForm className="justify-self-end" />
      </Chat>
    </RootLayout>
  )
}

export default App

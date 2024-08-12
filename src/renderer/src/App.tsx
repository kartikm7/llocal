import { Chat, RootLayout, Settings, Sidebar } from './components/AppLayout'
import { InputForm } from './components/Chat/InputForm'
import { Messages } from './components/Chat/Messages'
import { ChatList } from './components/Sidebar/ChatList'
import { NewChat } from './components/Sidebar/NewChat'
import { Separator } from './ui/Separator'
import { CommandCentre } from './components/Sidebar/CommandCentre'
import { useAtom, useSetAtom } from 'jotai/react'
import { backgroundImageAtom, darkModeAtom, isOllamaInstalledAtom } from './store/mocks'
import { Toaster } from 'sonner'
import { useEffect } from 'react'
import { ollamaServe } from './utils/ollama'
import { Categories } from './components/Settings/Categories'
import { GetVersion } from './components/Settings/GetVersion'

function App(): JSX.Element {
  const [backgroundImage] = useAtom(backgroundImageAtom)
  const setIsOllamaInstalled = useSetAtom(isOllamaInstalledAtom)
  // Ensuring the state update according to preference
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)
  const mode = localStorage.getItem('darkMode') === 'false' ? false : true
  setDarkMode(mode ?? true)
  // Serving ollama, if not present, then downloading ollama
  useEffect(() => {
    ollamaServe(setIsOllamaInstalled)
  }, [])

  return (
    <RootLayout
      className={`${darkMode && 'dark'} bg-[#DDDDDD] relative font-poppins scrollbar scrollbar-thumb-thin dark:bg-[#2c2c2c] dark:text-foreground w-full bg-cover h-screen`}
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <Toaster className='font-poppins text-base' richColors theme={darkMode ? 'dark' : 'light'} />
      <Settings className="justify-between items-center gap-14 overflow-y-scroll">
        <Categories />
        <div>
        <GetVersion />
      </div>
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

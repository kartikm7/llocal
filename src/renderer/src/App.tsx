import { Chat, RootLayout, Settings, Sidebar } from './components/AppLayout'
import { InputForm } from './components/Chat/InputForm'
import { Messages } from './components/Chat/Messages'
import { ChatList } from './components/Sidebar/ChatList'
import { NewChat } from './components/Sidebar/NewChat'
import { Separator } from './ui/Separator'
import { CommandCentre } from './components/Sidebar/CommandCentre'
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react'
import { backgroundImageAtom, isOllamaInstalledAtom, languageAtom, transparencyModeAtom } from './store/mocks'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { ollamaServe } from './utils/ollama'
import { Categories } from './components/Settings/Categories'
import { GetVersion } from './components/Settings/GetVersion'
import { TitleBar } from './components/TitleBar/Titlebar'
import { Theme, ThemeProvider } from './ui/ThemeProvider'

function App(): JSX.Element {
  const [platform, setPlatform] = useState("")
  const [backgroundImage] = useAtom(backgroundImageAtom)
  const setIsOllamaInstalled = useSetAtom(isOllamaInstalledAtom)

  // Ensuring the state update according to preference
  const theme = localStorage.getItem('darkMode') as Theme
  const language = useAtomValue(languageAtom)

  // Ensuring transparency mode preference
  const transparencyMode = useAtomValue(transparencyModeAtom)
  // Serving ollama, if not present, then downloading ollama
  useEffect(() => {
    async function getPlatform(): Promise<void> {
      setPlatform(await window.api.checkPlatform())
    }
    getPlatform()
    ollamaServe(setIsOllamaInstalled)
  }, [])


  // need to re-renderer all the children whenever the langauge changes
  useEffect(() => {
  }, [language])

  return (
    <ThemeProvider defaultTheme='dark' storageKey='darkMode'>
      <RootLayout
        className={`${transparencyMode ? 'bg-transparent' : 'bg-[#DDDDDD] dark:bg-[#2c2c2c]'} relative font-poppins scrollbar scrollbar-thumb-thin dark:text-foreground bg-cover w-full h-screen overflow-hidden`}
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
      >
        {platform == "win32" && <TitleBar />}
        <Toaster className='font-poppins text-base' richColors theme={theme} />
        <Settings className="justify-between items-center gap-14 overflow-y-scroll">
          <Categories />
          <GetVersion className='pt-20 lg:p-0' />
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
      </RootLayout >
    </ThemeProvider>
  )
}

export default App

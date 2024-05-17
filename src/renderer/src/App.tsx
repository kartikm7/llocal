import { Chat, RootLayout, Sidebar } from './components/AppLayout'
import BackgroundImage from "./assets/themes/galaxia.svg"
import { InputForm } from './components/InputForm'

function App(): JSX.Element {
  return (
    <RootLayout className="font-poppins dark dark:bg-background dark:text-foreground w-full bg-cover h-screen" style={{backgroundImage: `url(${BackgroundImage})`}}>
      <Sidebar className="">
      </Sidebar>
      <Chat className="justify-between">
        <InputForm className='self-end' />
      </Chat>
    </RootLayout>
  )
}

export default App

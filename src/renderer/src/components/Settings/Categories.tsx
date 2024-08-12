import { Navbar, NavbarItem } from '@renderer/ui/Navbar'
import React, { useState } from 'react'
import { ModelConfiguration } from '../AppLayout'
import { Separator } from '@renderer/ui/Separator'
import { ChooseModel } from './ChooseModel'
import { PullModel } from './PullModel'
import { BackgroundSelector } from './BackgroundSelector'
import { ModeSelector } from './ModeSelector'
import { KnowLedgeBase } from './KnowledgeBase'

export const Categories = (): React.ReactElement => {
  // to maintain state of what is selected, this helps with choosing what to render
  const [selected, setSelected] = useState('settings')
  const map = new Map() // this is to store the component in key value pairs
  map.set(
    'settings',
    <>
      {/* <h1 className="mt-10 text-4xl">Settings</h1> */}
      <div className="flex flex-col gap-10 lg:flex-row  lg:gap-24">
        <ModelConfiguration className="flex flex-col gap-5">
          <h1 className="text-xl">Model:</h1>
          <Separator className="mb-8" />
          <ChooseModel />
          <PullModel />
        </ModelConfiguration>
        <div className="flex flex-col gap-5">
          <h1 className="text-xl">Theme:</h1>
          <Separator className="mb-8" />
          <BackgroundSelector />
          <ModeSelector />
        </div>
      </div>
    </>
  )

  map.set('knowledgeBase', <KnowLedgeBase />)
  return (
    <>
      <Navbar className='sticky'>
        <NavbarItem className={`${selected == 'settings' && 'opacity-100'}`} onClick={()=>setSelected('settings')}>Settings</NavbarItem>
        <NavbarItem className={`${selected == 'knowledgeBase' && 'opacity-100'}`} onClick={()=>setSelected('knowledgeBase')}>Knowledge Base</NavbarItem>
      </Navbar>
      {map.get(selected)}
    </>
  )
}

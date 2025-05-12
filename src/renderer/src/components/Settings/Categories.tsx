import { Navbar, NavbarItem } from '@renderer/ui/Navbar'
import React, { useState } from 'react'
import { ModelConfiguration } from '../AppLayout'
// import { Separator } from '@renderer/ui/Separator'
import { ChooseModel } from './ChooseModel'
import { PullModel } from './PullModel'
import { BackgroundSelector } from './BackgroundSelector'
import { ModeSelector } from './ModeSelector'
import { KnowLedgeBase } from './KnowledgeBase'
import Preferences from './Preferences'
import { t } from '@renderer/utils/utils'
import { ChooseLanguage } from './ChooseLanguage'

export const Categories = (): React.ReactElement => {
  // to maintain state of what is selected, this helps with choosing what to render
  const [selected, setSelected] = useState('settings')
  const map = new Map() // this is to store the component in key value pairs
  map.set(
    'settings',
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-24 h-full">
      <ModelConfiguration className="flex flex-col gap-5">
        <ChooseModel />
        <PullModel />
        <ChooseLanguage />
      </ModelConfiguration>
      <div className='flex flex-col gap-2 '>
        <div className="flex flex-col gap-5">
          <BackgroundSelector />
          <ModeSelector />
        </div>
        <Preferences />
      </div>
    </div>
  )

  map.set('knowledgeBase', <KnowLedgeBase />)
  // map.set('experimental', <Preferences />)
  return (
    <>
      <Navbar className='sticky'>
        <NavbarItem className={`${selected == 'settings' && 'opacity-100'}`} onClick={() => setSelected('settings')}>{t("Settings")}</NavbarItem>
        <NavbarItem className={`${selected == 'knowledgeBase' && 'opacity-100'}`} onClick={() => setSelected('knowledgeBase')}>{t("Knowledge Base")}</NavbarItem>
        {/* <NavbarItem className={`${selected == 'experimental' && 'opacity-100'}`} onClick={() => setSelected('experimental')}>Experimental</NavbarItem> */}
      </Navbar>
      {map.get(selected)}
    </>
  )
}

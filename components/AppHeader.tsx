import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { UserButton } from '@clerk/nextjs'

const AppHeader = () => {
    return (
        <div className='flex items-center justify-between p-4 shadow-sm'>
            <SidebarTrigger />
            <UserButton />
        </div>
    )
}

export default AppHeader

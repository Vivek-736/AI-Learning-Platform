import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { ArrowLeftCircleIcon } from 'lucide-react'
import Link from 'next/link'

const AppHeader = ({ hideSidebar = false }) => {
    return (
        <div className={`flex items-center justify-between p-4 shadow-sm sticky top-0 bg-[#FFFFFF] z-10`}>
            {hideSidebar && <Link href="/workspace"><ArrowLeftCircleIcon className="h-6 w-6 text-purple-800" /></Link>}
            {!hideSidebar && <SidebarTrigger />}
            <UserButton />
        </div>
    )
}

export default AppHeader

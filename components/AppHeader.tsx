import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import { ArrowLeftCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

const AppHeader = ({ hideSidebar = false }) => {
    return (
        <div className={`flex items-center justify-between p-4 shadow-sm sticky top-0 bg-white dark:bg-slate-950 z-10`}>
            {hideSidebar && <Link href="/workspace"><ArrowLeftCircleIcon className="h-6 w-6 text-gray-800 dark:text-gray-200" /></Link>}
            {!hideSidebar && <SidebarTrigger />}
            <div className="flex items-center gap-3">
                <ModeToggle />
                <UserButton />
            </div>
        </div>
    )
}

export default AppHeader

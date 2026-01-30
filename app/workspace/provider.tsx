import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <AppHeader />
                <div className='sm:p-10 p-2'>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceProvider

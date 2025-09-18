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
                {children}
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceProvider

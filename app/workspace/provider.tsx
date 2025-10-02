import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar'
import AppHeader from '@/components/AppHeader'
import PWAInstallButton from '@/components/PWAInstallButton'

const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <AppHeader />
                <div className='p-10'>
                    {children}
                </div>
                <PWAInstallButton />
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceProvider

import { UserButton } from '@clerk/nextjs'
import React from 'react'

const WorkspacePage = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <UserButton />
        </div>
    )
}

export default WorkspacePage

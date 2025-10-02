'use client';

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/userDetailContext';
import { SelectedChapterIndexContext } from '@/context/selectedChapterIndexContext';
import { AssistantProvider } from '@/context/assistantContext';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

function Provider( { children }: { children: React.ReactNode } ) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState();
    const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        user && CreateNewUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const CreateNewUser = async () => {
        const result = await axios.post('/api/user', {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress
        });
        // console.log("User data:", result.data);
        
        setUserDetail(result.data);
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <SelectedChapterIndexContext.Provider value={{ selectedChapterIndex, setSelectedChapterIndex }}>
                <AssistantProvider>
                    <div>
                        {children}
                    </div>
                    <ServiceWorkerRegistration />
                </AssistantProvider>
            </SelectedChapterIndexContext.Provider>
        </UserDetailContext.Provider>
    )
}

export default Provider

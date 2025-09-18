'use client';

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { UserDetailContext } from '@/context/userDetailContext';

function Provider( { children }: { children: React.ReactNode } ) {
    const { user } = useUser();
    const [userDetail, setUserDetail] = useState();

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
        console.log("User data:", result.data);
        
        setUserDetail(result.data);
    }

    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div>
                {children}
            </div>
        </UserDetailContext.Provider>
    )
}

export default Provider

'use client';

import React, { useEffect } from 'react'
import axios from 'axios';
import { useUser } from '@clerk/nextjs';

function Provider( { children }: { children: React.ReactNode } ) {
    const { user } = useUser();

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
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default Provider

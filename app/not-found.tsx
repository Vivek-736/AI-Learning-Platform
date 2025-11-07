
import React from 'react'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

const NotFoundPage = () => {
    return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
            <div className='max-w-md w-full text-center'>
                <div className='relative mb-8'>
                    <div className='text-8xl font-light text-gray-600 mb-4 select-none'>404</div>
                </div>

                <div className='mb-8'>
                    <h1 className='text-2xl font-semibold text-gray-900 mb-3'>Page Not Found</h1>
                    <p className='text-gray-600 leading-relaxed'>
                        The page you&apos;re looking for doesn&apos;t exist or has been moved. 
                        Let&apos;s get you back to learning.
                    </p>
                </div>

                <div className='flex flex-col gap-y-4'>
                    <Link href='/workspace'>
                        <button className='w-full cursor-pointer bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2'>
                            <Home className='w-4 h-4' />
                            Back to Dashboard
                        </button>
                    </Link>
                    <Link href='/'>
                        <button className='w-full cursor-pointer bg-[#FFFFFF] text-gray-700 py-3 px-6 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2'>
                            <ArrowLeft className='w-4 h-4' />
                            Go Back
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage

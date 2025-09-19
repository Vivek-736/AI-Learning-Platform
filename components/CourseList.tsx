'use client';

import Image from 'next/image';
import React, { useState } from 'react'
import { Button } from './ui/button';
import AddNewCourseDialog from './AddNewCourseDialog';

const CourseList = () => {
    const [courseList, setCourseList] = useState([]);

    return (
        <div className='mt-10'>
            <h2 className='font-bold text-3xl'>
                Course List
            </h2>
            {courseList?.length == 0 ? <div className='flex p-7 gap-y-3 items-center justify-center flex-col border-black border-dashed border-2 rounded-xl mt-6 bg-purple-50'>
                <Image src={'/workspace.png'} alt='education' width={80} height={80} />
                <h2 className='my-2 text-xl font-bold'>Looks like you haven&apos;t created any course yet</h2>
                <AddNewCourseDialog>
                    <Button className='cursor-pointer'>
                        Create your first course
                    </Button>
                </AddNewCourseDialog>
            </div> : 
            <div>
                
            </div>}
        </div>
    )
}

export default CourseList

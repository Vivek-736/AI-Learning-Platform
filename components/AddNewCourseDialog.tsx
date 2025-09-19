import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Sparkles } from 'lucide-react'

const AddNewCourseDialog = ({ children }: { children: React.ReactNode }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        noOfChapters: 1,
        includeVideo: false,
        level: '',
        category: ''
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onHandleInputChange = (field: any, value: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
        console.log(formData);
    }

    const onGenerate = () => {
        console.log(formData);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='text-center text-2xl font-bold mb-6'>
                        Create New Course Using AI
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <div className='flex flex-col gap-y-2'>
                                <label className='ml-0.5 text-gray-900'>
                                    Course Name
                                </label>
                                <Input placeholder='Enter Course Name' onChange={(event) => onHandleInputChange('name', event?.target.value)} />
                            </div>
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <label className='ml-0.5 text-gray-900'>
                                    Course Description (Optional)
                                </label>
                                <Textarea placeholder='Enter Course Description' onChange={(event) => onHandleInputChange('description', event?.target.value)} />
                            </div>
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <label className='ml-0.5 text-gray-900'>
                                    Number of Chapters
                                </label>
                                <Input placeholder='Enter Number of Chapters' type='number' onChange={(event) => onHandleInputChange('noOfChapters', event?.target.value)} />
                            </div>
                            <div className='mt-4 flex gap-x-4 items-center'>
                                <label className='ml-0.5 text-gray-900'>
                                    Include Video
                                </label>
                                <Switch 
                                    onCheckedChange={() => onHandleInputChange('includeVideo', !formData?.includeVideo)}
                                />
                            </div>
                            <div className='mt-4 flex flex-col gap-y-2'>
                                <label className='ml-0.5 text-gray-900'>
                                    Difficulty Level
                                </label>
                                <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Difficulty Level' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='beginner'>
                                            Beginner
                                        </SelectItem>
                                        <SelectItem value='moderate'>
                                            Moderate
                                        </SelectItem>
                                        <SelectItem value='advanced'>
                                            Advanced
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='mt-4 flex flex-col gap-y-2'>
                                <label className='ml-0.5 text-gray-900'>
                                    Category
                                </label>
                                <Input placeholder='Enter Course Category (Separated by Commas)' onChange={(event) => onHandleInputChange('category', event?.target.value)} />
                            </div>
                            <div className='mt-6 text-center'>
                                <Button className='w-full cursor-pointer' onClick={onGenerate}>
                                    <Sparkles /> Generate Course
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog

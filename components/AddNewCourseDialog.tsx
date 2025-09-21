import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Loader, Sparkles } from 'lucide-react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const AddNewCourseDialog = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        noOfChapters: 1,
        includeVideo: false,
        level: '',
        category: ''
    });
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onHandleInputChange = (field: any, value: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
        console.log(formData);
    };

    const onGenerate = async () => {
        console.log(formData);
        const courseId = uuidv4();
        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId
            });
            console.log(result.data);
            setLoading(false);
            setOpen(false);
            router.push(`/workspace/edit-course/${result.data?.courseId}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                <Input
                                    placeholder='Enter Course Name'
                                    onChange={(event) => onHandleInputChange('name', event?.target.value)}
                                />
                            </div>
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <label className='ml-0.5 text-gray-900'>
                                    Course Description (Optional)
                                </label>
                                <Textarea
                                    placeholder='Enter Course Description'
                                    onChange={(event) => onHandleInputChange('description', event?.target.value)}
                                />
                            </div>
                            <div className='flex flex-col gap-y-2 mt-4'>
                                <label className='ml-0.5 text-gray-900'>
                                    Number of Chapters
                                </label>
                                <Input
                                    placeholder='Enter Number of Chapters'
                                    type='number'
                                    onChange={(event) => onHandleInputChange('noOfChapters', event?.target.value)}
                                />
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
                                <Input
                                    placeholder='Enter Course Category (Separated by Commas)'
                                    onChange={(event) => onHandleInputChange('category', event?.target.value)}
                                />
                            </div>
                            <div className='mt-6 text-center'>
                                <Button
                                    className='w-full cursor-pointer'
                                    disabled={loading}
                                    onClick={onGenerate}
                                >
                                    {loading ? <Loader className='animate-spin' /> : <Sparkles />}
                                    {loading ? 'Generating Course...' : 'Generate Course'}
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewCourseDialog;

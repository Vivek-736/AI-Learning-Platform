'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader, BookOpen, PenTool } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface CreateQuizDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onQuizCreated: () => void;
}

interface Course {
    cid: string;
    name: string;
}

const CreateQuizDialog: React.FC<CreateQuizDialogProps> = ({
    open,
    onOpenChange,
    onQuizCreated
}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'course',
        courseId: '',
        customTopic: '',
        difficulty: 'medium',
        questionCount: '10'
    });

    useEffect(() => {
        if (open) {
            fetchEnrolledCourses();
        }
    }, [open]);

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get('/api/enroll-course');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setCourses(response.data.map((item: any) => ({
                cid: item.courses.cid,
                name: item.courses.name
            })));
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                difficulty: formData.difficulty,
                questionCount: parseInt(formData.questionCount),
                ...(formData.type === 'course' 
                    ? { courseId: formData.courseId }
                    : { customTopic: formData.customTopic }
                )
            };

            await axios.post('/api/quiz/generate', payload);
            toast.success('Quiz generated successfully!');
            onQuizCreated();
            resetForm();
        } catch (error) {
            console.error('Error creating quiz:', error);
            toast.error('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'course',
            courseId: '',
            customTopic: '',
            difficulty: 'medium',
            questionCount: '10'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader className='text-center'>
                    <DialogTitle className="text-2xl font-bold text-center dark:text-white">Create New Quiz</DialogTitle>
                    <DialogDescription className='text-center dark:text-gray-400'>
                        Generate an AI-powered quiz from your courses or custom topics
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title" className='ml-1 mb-2 dark:text-gray-300'>Quiz Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter quiz title..."
                                required
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="description" className='ml-1 mb-2 dark:text-gray-300'>Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief description of the quiz..."
                                rows={3}
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className='ml-1 mb-2 dark:text-gray-300'>Quiz Source</Label>
                        <RadioGroup
                            value={formData.type}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onValueChange={(value: any) => setFormData({...formData, type: value})}
                        >
                            <div className="flex items-center space-x-2 p-4 border rounded-lg dark:border-gray-800">
                                <RadioGroupItem value="course" id="course" />
                                <BookOpen className="h-4 w-4 dark:text-gray-400" />
                                <Label htmlFor="course" className="flex-1 cursor-pointer dark:text-gray-300">
                                    Based on Enrolled Course
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border rounded-lg dark:border-gray-800">
                                <RadioGroupItem value="custom" id="custom" />
                                <PenTool className="h-4 w-4 dark:text-gray-400" />
                                <Label htmlFor="custom" className="flex-1 cursor-pointer dark:text-gray-300">
                                    Custom Topic
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {formData.type === 'course' ? (
                        <div>
                            <Label className='ml-1 mb-2 dark:text-gray-300'>Select Course</Label>
                            <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectValue placeholder="Choose a course..." />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                    {courses.map((course) => (
                                        <SelectItem key={course.cid} value={course.cid}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <div>
                            <Label htmlFor="customTopic" className='ml-1 mb-2 dark:text-gray-300'>Custom Topic</Label>
                            <Input
                                id="customTopic"
                                value={formData.customTopic}
                                onChange={(e) => setFormData({...formData, customTopic: e.target.value})}
                                placeholder="e.g., JavaScript Arrays, React Hooks, etc."
                                required={formData.type === 'custom'}
                                className="dark:bg-gray-800 dark:border-gray-700"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className='ml-1 mb-2 dark:text-gray-300'>Difficulty Level</Label>
                            <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <Label className='ml-1 mb-2 dark:text-gray-300'>Number of Questions</Label>
                            <Select value={formData.questionCount} onValueChange={(value) => setFormData({...formData, questionCount: value})}>
                                <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                    <SelectItem value="5">5 Questions</SelectItem>
                                    <SelectItem value="10">10 Questions</SelectItem>
                                    <SelectItem value="15">15 Questions</SelectItem>
                                    <SelectItem value="20">20 Questions</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className='cursor-pointer dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || (!formData.courseId && formData.type === 'course') || (!formData.customTopic && formData.type === 'custom')}
                            className="bg-primary cursor-pointer text-white min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Quiz'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateQuizDialog;

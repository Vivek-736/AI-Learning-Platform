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

interface CreateFlashcardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFlashcardCreated: () => void;
}

interface Course {
    cid: string;
    name: string;
}

const CreateFlashcardDialog: React.FC<CreateFlashcardDialogProps> = ({
    open,
    onOpenChange,
    onFlashcardCreated
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
        cardCount: '10'
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
                cardCount: parseInt(formData.cardCount),
                ...(formData.type === 'course' 
                    ? { courseId: formData.courseId }
                    : { customTopic: formData.customTopic }
                )
            };

            await axios.post('/api/flashcard/generate', payload);
            toast.success('Flashcards generated successfully!');
            onFlashcardCreated();
            resetForm();
        } catch (error) {
            console.error('Error creating flashcards:', error);
            toast.error('Failed to generate flashcards. Please try again.');
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
            cardCount: '10'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Create Flashcard Set</DialogTitle>
                    <DialogDescription className='text-center'>
                        Generate AI-powered flashcards from your courses or custom topics
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label className='ml-1 mb-2' htmlFor="title">Set Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter flashcard set title..."
                                required
                            />
                        </div>
                        <div>
                            <Label className='ml-1 mb-2' htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Brief description of the flashcard set..."
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className='ml-1'>Flashcard Source</Label>
                        <RadioGroup
                            value={formData.type}
                            onValueChange={(value) => setFormData({...formData, type: value})}
                        >
                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                <RadioGroupItem value="course" id="course" />
                                <BookOpen className="h-4 w-4" />
                                <Label htmlFor="course" className="flex-1 cursor-pointer">
                                    Based on Enrolled Course
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                <RadioGroupItem value="custom" id="custom" />
                                <PenTool className="h-4 w-4" />
                                <Label htmlFor="custom" className="flex-1 cursor-pointer">
                                    Custom Topic
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {formData.type === 'course' ? (
                        <div>
                            <Label className='ml-1 mb-2'>Select Course</Label>
                            <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a course..." />
                                </SelectTrigger>
                                <SelectContent>
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
                            <Label className='ml-1 mb-2' htmlFor="customTopic">Custom Topic</Label>
                            <Input
                                id="customTopic"
                                value={formData.customTopic}
                                onChange={(e) => setFormData({...formData, customTopic: e.target.value})}
                                placeholder="e.g., Machine Learning Algorithms, World History, etc."
                                required={formData.type === 'custom'}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className='ml-1 mb-2'>Difficulty Level</Label>
                            <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div>
                            <Label className='ml-1 mb-2'>Number of Cards</Label>
                            <Select value={formData.cardCount} onValueChange={(value) => setFormData({...formData, cardCount: value})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 Cards</SelectItem>
                                    <SelectItem value="10">10 Cards</SelectItem>
                                    <SelectItem value="15">15 Cards</SelectItem>
                                    <SelectItem value="20">20 Cards</SelectItem>
                                    <SelectItem value="25">25 Cards</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <Button
                            type="button"
                            className='cursor-pointer'
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || (!formData.courseId && formData.type === 'course') || (!formData.customTopic && formData.type === 'custom')}
                            className="from-green-600 cursor-pointer text-white min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Cards'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateFlashcardDialog;

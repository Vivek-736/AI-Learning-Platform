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
import { Loader, BookOpen } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface CreateInterviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTemplateCreated: () => void;
}

interface Course {
    cid: string;
    name: string;
}

const CreateInterviewDialog: React.FC<CreateInterviewDialogProps> = ({
    open,
    onOpenChange,
    onTemplateCreated
}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        difficulty: 'medium',
        estimatedDuration: '15'
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
            await axios.post('/api/interview/templates', {
                title: formData.title,
                description: formData.description,
                courseId: formData.courseId,
                difficulty: formData.difficulty,
                estimatedDuration: parseInt(formData.estimatedDuration)
            });

            toast.success('Interview template created successfully!');
            onTemplateCreated();
            resetForm();
        } catch (error) {
            console.error('Error creating template:', error);
            toast.error('Failed to create interview template');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            courseId: '',
            difficulty: 'medium',
            estimatedDuration: '15'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className='text-center'>Create Interview Template</DialogTitle>
                    <DialogDescription className='text-center'>
                        Create a voice interview template based on your course content
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label className='ml-1 mb-2' htmlFor="title">Interview Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g., React Developer Interview"
                            required
                        />
                    </div>

                    <div>
                        <Label className='ml-1 mb-2' htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Brief description of what this interview will assess..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label className='ml-1 mb-2'>Select Course</Label>
                        <Select value={formData.courseId} onValueChange={(value) => setFormData({...formData, courseId: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a course..." />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course.cid} value={course.cid}>
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            {course.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

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
                            <Label className='ml-1 mb-2'>Duration (minutes)</Label>
                            <Select value={formData.estimatedDuration} onValueChange={(value) => setFormData({...formData, estimatedDuration: value})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10 minutes</SelectItem>
                                    <SelectItem value="15">15 minutes</SelectItem>
                                    <SelectItem value="20">20 minutes</SelectItem>
                                    <SelectItem value="30">30 minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" className='cursor-pointer' onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className='cursor-pointer' disabled={loading || !formData.courseId}>
                            {loading ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Interview'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateInterviewDialog;

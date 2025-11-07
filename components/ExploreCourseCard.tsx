'use client';

import { Book, Loader, PlayCircle, Settings, Clock, Award } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge"
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';

interface Course {
  cid: string;
  name: string;
  description?: string;
  bannerImageUrl?: string;
  level: string;
  category?: string;
  noOfChapters: number;
  includeVideo?: boolean;
  userEmail: string;
  courseJson: {
    course: {
      name: string;
      description: string;
      noOfChapters: number;
    };
  };
  courseContent?: unknown[];
}

interface ExploreCourseCardProps {
  course: Course;
  onEnrollSuccess?: () => void;
}

const ExploreCourseCard: React.FC<ExploreCourseCardProps> = ({ course, onEnrollSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isContentGenerated, setIsContentGenerated] = useState<boolean>(!!course.courseContent?.length);
  const courseLayout = course?.courseJson?.course;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateCourseContent = async (): Promise<void> => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await axios.post('/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      // console.log(result.data);
      setIsContentGenerated(true);
      setLoading(false);
      toast.success('Course content generated successfully!');
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error('Failed to generate course content. Please try again.');
    }
  };

  const onEnrollCourse = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await axios.post('/api/enroll-course', {
        courseId: course?.cid,
      });
      // console.log(result.data);
      if(result.data.res === 'Already Enrolled') {
        toast.warning('You are already enrolled in this course.');
        setIsLoading(false);
        return;
      }
      toast.success('Successfully enrolled in the course!');
      setIsLoading(false);
      
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast.error('Failed to enroll in course. Please try again.');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-black-100 text-indigo-800 border-indigo-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-cyan-100 text-cyan-800 border-cyan-200',
    ];
    const index = category?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <div className="group rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] transition-all duration-300 bg-[#FFFFFF] overflow-hidden">
      <div className="relative">
        <Image
          src={course?.bannerImageUrl || '/course.jpg'}
          alt="Course Banner"
          width={400}
          height={400}
          className="w-full h-48 object-cover transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {course.level && (
            <Badge className={`text-xs font-medium border ${getLevelColor(course.level)}`}>
              <Award className="w-3 h-3 mr-1" />
              {course.level}
            </Badge>
          )}
        </div>
        {course.category && (
          <div className="absolute top-2 right-3">
            <Badge className={`text-xs font-medium border ${getCategoryColor(course.category)}`}>
              {course.category}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-2">
          <h2 className="font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-indigo-700 transition-colors duration-200">
            {courseLayout?.name || course.name}
          </h2>
          <p className="line-clamp-2 text-gray-600 text-sm leading-relaxed">
            {courseLayout?.description || course.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Book className="h-4 w-4 text-indigo-600" />
            <span className="font-medium">{course.noOfChapters || courseLayout?.noOfChapters} Chapters</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Self-paced</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="xl:text-[10px] 2xl:text-xs text-xs text-gray-500">
            <span>Created by:</span>
            <span className="font-medium text-gray-700 ml-1">
              {course.userEmail?.split('@')[0].replace(/\d.*$/, '')}
            </span>
          </div>
          
          {isContentGenerated ? (
            <Button 
              disabled={isLoading} 
              onClick={onEnrollCourse} 
              className="cursor-pointer bg-black hover:bg-slate-900 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg" 
              size="sm"
            >
              {!isLoading ? (
                <PlayCircle className="mr-2 h-4 w-4" />
              ) : (
                <Loader className='animate-spin mr-2 h-4 w-4' />
              )}  
              {isLoading ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          ) : (
            <Button
              size="sm"
              className="cursor-pointer border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-6 py-2 rounded-lg font-medium transition-all duration-200"
              variant="outline"
              onClick={generateCourseContent}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> 
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" /> 
                  <span>Generate</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExploreCourseCard;

'use client';

import { Book, Loader, PlayCircle, Settings } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';

interface Course {
  cid: string;
  name: string;
  bannerImageUrl?: string;
  courseJson: {
    course: {
      name: string;
      description: string;
      noOfChapters: number;
    };
  };
  courseContent?: unknown[];
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [loading, setLoading] = useState(false);
  const [isContentGenerated, setIsContentGenerated] = useState(!!course.courseContent?.length);
  const courseLayout = course?.courseJson?.course;

  const generateCourseContent = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      console.log(result.data);
      setIsContentGenerated(true);
      setLoading(false);
      toast.success('Course generated successfully!');
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error('An error occurred while generating course content. Please try again.');
    }
  };

  return (
    <div className="rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] mt-4">
      <Image
        src={course?.bannerImageUrl || '/course.jpg'}
        alt="Course Banner"
        width={400}
        height={400}
        className="w-full rounded-t-2xl object-cover aspect-video"
      />
      <div className="p-3 flex flex-col gap-3">
        <h2 className="font-bold text-lg line-clamp-1">{courseLayout?.name}</h2>
        <p className="line-clamp-2 text-gray-500 text-sm">{courseLayout?.description}</p>
        <div className="flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-sm">
            <Book className="h-5 w-5 text-primary" /> {courseLayout?.noOfChapters} Chapters
          </h2>
          {isContentGenerated ? (
            <Button className="cursor-pointer" size="sm">
              <PlayCircle className="mr-2 h-4 w-4" /> Start Learning
            </Button>
          ) : (
            <Button
              size="sm"
              className="cursor-pointer"
              variant="outline"
              onClick={generateCourseContent}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" /> Generate Course
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

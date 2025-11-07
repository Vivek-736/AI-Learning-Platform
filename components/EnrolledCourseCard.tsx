import React from "react";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlayCircleIcon, CheckCircle } from "lucide-react";
import Link from "next/link";

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

interface EnrollCourse {
  completedChapters?: number[];
}

interface EnrolledCourseCardProps {
  course: Course;
  enrollCourse?: EnrollCourse;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({
  course,
  enrollCourse,
}) => {
  const courseLayout = course?.courseJson?.course;

  const CalculateProgress = (): number => {
    const completedChapters = enrollCourse?.completedChapters?.length ?? 0;
    const totalChapters = course?.courseContent?.length ?? 1;
    return Math.min((completedChapters / totalChapters) * 100, 100);
  };

  const getProgressColor = (): string => {
    const progress = CalculateProgress();
    if (progress === 100) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    return 'text-primary';
  };

  const getProgressBgColor = (): string => {
    const progress = CalculateProgress();
    if (progress === 100) return 'bg-green-100';
    if (progress >= 50) return 'bg-blue-50';
    return 'bg-indigo-50';
  };

  const isCompleted = CalculateProgress() === 100;
  const completedChaptersCount = enrollCourse?.completedChapters?.length ?? 0;
  const totalChapters = course?.courseContent?.length ?? 0;

  return (
    <div className={`rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] mt-4 transition-all duration-300 ${
      isCompleted ? 'ring-2 ring-green-300' : ''
    }`}>
      <div className="relative">
        <Image
          src={course?.bannerImageUrl || "/course.jpg"}
          alt="Course Banner"
          width={400}
          height={400}
          className="w-full rounded-t-2xl object-cover aspect-video"
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-600 text-white p-2 rounded-full shadow-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <h2 className="font-bold text-lg line-clamp-1 flex-1">{courseLayout?.name}</h2>
          {isCompleted && (
            <span className="text-green-600 text-sm font-medium ml-2">✓ Complete</span>
          )}
        </div>
        
        <p className="line-clamp-2 text-gray-500 text-sm">
          {courseLayout?.description}
        </p>
        
        <div className={`p-3 rounded-lg ${getProgressBgColor()}`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-sm font-medium ${getProgressColor()}`}>
              Progress
            </h2>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${getProgressColor()}`}>
                {Math.round(CalculateProgress())}%
              </span>
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
            </div>
          </div>
          
          <Progress 
            value={CalculateProgress()} 
            className="mb-2"
          />
          
          <div className="flex justify-between text-xs text-gray-600">
            <span>{completedChaptersCount} of {totalChapters} chapters completed</span>
            <span>{totalChapters - completedChaptersCount} remaining</span>
          </div>
        </div>

        <Link href={`/workspace/view-course/${course?.cid}`}>
          <Button className={`w-full mt-2 cursor-pointer transition-all duration-200 ${
            isCompleted 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-primary hover:bg-primary/90'
          }`}>
            <PlayCircleIcon className="mr-2 h-4 w-4" />
            {isCompleted ? 'Review Course' : 'Continue Learning'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;

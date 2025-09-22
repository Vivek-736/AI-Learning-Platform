import React from "react";
import Image from "next/image";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { PlayCircleIcon } from "lucide-react";
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
  completedChapters?: unknown[];
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
    return (completedChapters / totalChapters) * 100;
  };

  return (
    <div className="rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] mt-4">
      <Image
        src={course?.bannerImageUrl || "/course.jpg"}
        alt="Course Banner"
        width={400}
        height={400}
        className="w-full rounded-t-2xl object-cover aspect-video"
      />
      <div className="p-3 flex flex-col gap-3">
        <h2 className="font-bold text-lg line-clamp-1">{courseLayout?.name}</h2>
        <p className="line-clamp-2 text-gray-500 text-sm">
          {courseLayout?.description}
        </p>
        <div className="">
          <h2 className="flex justify-between text-sm text-primary mb-2">
            Progress <span>{Math.round(CalculateProgress())}%</span>
          </h2>
          <Progress value={CalculateProgress()} />
          <Link href={`/workspace/view-course/${course?.cid}`}>
            <Button className="w-full mt-3 cursor-pointer">
                <PlayCircleIcon className="mr-2 h-4 w-4" /> Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;

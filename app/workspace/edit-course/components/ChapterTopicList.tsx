import React from "react";
import { Gift, BookOpen, CheckCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChapterTopicListProps {
  course: any;
}

const ChapterTopicList = ({ course }: ChapterTopicListProps) => {
  const courseLayout = course?.courseJson?.course;

  return (
    <div>
      <h2 className="font-bold text-3xl mt-10">Chapters and Topics</h2>
      <div className="flex flex-col items-center justify-center mt-10">
        {courseLayout?.chapters.map((chapter: any, index: any) => (
          <div key={index} className="flex flex-col items-center">
            <div className="p-4 border shadow rounded-xl bg-primary text-white w-full max-w-md">
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h2 className="text-center">Chapter {index + 1}</h2>
              </div>
              <h2 className="font-bold text-lg text-center mt-1">
                {chapter.chapterName}
              </h2>
              <h2 className="text-xs flex justify-between mt-2">
                <span>Duration: {chapter?.duration}</span>
                <span>No. Of Topics: {chapter?.topics?.length}</span>
              </h2>
            </div>
            <div>
              {chapter?.topics.map((topic: any, index: any) => (
                <div className="flex flex-col items-center" key={index}>
                  <div className="h-10 bg-gray-300 w-1"></div>
                  <div className="flex items-center gap-5">
                    <span
                      className={`${
                        index % 2 === 0 && "text-transparent"
                      } max-w-xs`}
                    >
                      {topic}
                    </span>
                    <h2 className="text-center rounded-full bg-gray-300 px-6 text-gray-500 p-4">
                      {index + 1}
                    </h2>
                    <span
                      className={`${
                        index % 2 !== 0 && "text-transparent"
                      } max-w-xs`}
                    >
                      {topic}
                    </span>
                  </div>
                  {index === chapter?.topics?.length - 1 && (
                    <>
                      <div className="h-10 bg-gray-300 w-1"></div>
                      <div className="flex items-center gap-5">
                        <Gift className="text-center rounded-full bg-gray-300 h-14 w-14 text-gray-500 p-4" />
                      </div>
                      <div className="h-10 bg-gray-300 w-1"></div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="p-6 border shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white flex flex-col items-center gap-3 w-full max-w-sm">
          <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
          <h2 className="text-xl font-bold">Congratulations!</h2>
          <p className="text-sm text-center">
            You’ve successfully completed the course.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChapterTopicList;

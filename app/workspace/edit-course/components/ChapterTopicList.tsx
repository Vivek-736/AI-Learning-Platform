import React from "react";
import { Gift, BookOpen, CheckCircle } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ChapterTopicListProps {
  course: any;
  enrollCourse?: any;
}

const ChapterTopicList = ({ course, enrollCourse }: ChapterTopicListProps) => {
  const courseLayout = course?.courseJson?.course;
  const completedChapters = enrollCourse?.completedChapters ?? [];

  const isChapterCompleted = (chapterIndex: number) => {
    return completedChapters.includes(chapterIndex);
  };

  return (
    <div>
      <h2 className="font-bold text-3xl mt-10">Chapters and Topics</h2>
      <div className="flex flex-col items-center justify-center mt-10">
        {courseLayout?.chapters.map((chapter: any, chapterIndex: any) => {
          const completed = isChapterCompleted(chapterIndex);

          return (
            <div key={chapterIndex} className="flex flex-col items-center">
              <div
                className={`p-4 border shadow rounded-xl text-white w-full max-w-md transition-all duration-300 ${
                  completed
                    ? "bg-green-600 border-green-300"
                    : "bg-primary border-primary"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <BookOpen className="w-5 h-5" />
                  )}
                  <h2 className="text-center">
                    Chapter {chapterIndex + 1} {completed && "✓"}
                  </h2>
                </div>
                <h2 className="font-bold text-lg text-center mt-1">
                  {chapter.chapterName}
                </h2>
                <h2 className="text-xs flex justify-between mt-2">
                  <span>Duration: {chapter?.duration}</span>
                  <span>No. Of Topics: {chapter?.topics?.length}</span>
                </h2>
                {completed && (
                  <div className="text-center mt-2 text-xs bg-green-500 bg-opacity-50 rounded px-2 py-1">
                    ✓ Completed
                  </div>
                )}
              </div>
              <div>
                {chapter?.topics.map((topic: any, topicIndex: any) => (
                  <div className="flex flex-col items-center" key={topicIndex}>
                    <div
                      className={`h-10 w-1 ${
                        completed ? "bg-green-400" : "bg-gray-300"
                      }`}
                    ></div>
                    <div className="flex items-center gap-5">
                      <span
                        className={`${
                          topicIndex % 2 === 0 && "text-transparent"
                        } max-w-xs ${completed ? "text-green-700" : ""}`}
                      >
                        {topic}
                      </span>
                      <h2
                        className={`text-center rounded-full px-6 p-4 transition-colors duration-300 ${
                          completed
                            ? "bg-green-300 text-green-800"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        {topicIndex + 1}
                      </h2>
                      <span
                        className={`${
                          topicIndex % 2 !== 0 && "text-transparent"
                        } max-w-xs ${completed ? "text-green-700" : ""}`}
                      >
                        {topic}
                      </span>
                    </div>
                    {topicIndex === chapter?.topics?.length - 1 && (
                      <>
                        <div
                          className={`h-10 w-1 ${
                            completed ? "bg-green-400" : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="flex items-center gap-5">
                          <Gift
                            className={`text-center rounded-full h-14 w-14 p-4 transition-colors duration-300 ${
                              completed
                                ? "bg-green-300 text-green-600"
                                : "bg-gray-300 text-gray-500"
                            }`}
                          />
                        </div>
                        <div
                          className={`h-10 w-1 ${
                            completed ? "bg-green-400" : "bg-gray-300"
                          }`}
                        ></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="p-6 border shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white flex flex-col items-center gap-3 w-full max-w-sm">
          <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
          <h2 className="text-xl font-bold">Congratulations!</h2>
          <p className="text-sm text-center">
            You&apos;ve successfully completed the course.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChapterTopicList;

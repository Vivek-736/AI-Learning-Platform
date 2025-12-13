'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, CheckCircle, Search, GraduationCap } from 'lucide-react';
import { EnrolledCourse } from '@/types/assistant';

interface CourseSelectorProps {
  selectedEnrollment: EnrolledCourse | null;
  onEnrollmentChange: (enrollment: EnrolledCourse) => void;
}

export default function CourseSelector({ selectedEnrollment, onEnrollmentChange }: CourseSelectorProps) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEnrolledCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEnrolledCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/enroll-course');
      const data = await response.json();
      
      if (response.ok && Array.isArray(data)) {
        setEnrolledCourses(data);
        
        if (!selectedEnrollment && data.length > 0) {
          onEnrollmentChange(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading enrolled courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (enrollment: EnrolledCourse) => {
    const completed = enrollment.enrollCourse.completedChapters?.length || 0;
    const total = enrollment.courses.noOfChapters || 1;
    return Math.round((completed / total) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-indigo-600';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 70) return 'bg-blue-100';
    if (percentage >= 40) return 'bg-yellow-100';
    return 'bg-indigo-100';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-indigo-500';
  };

  const filteredCourses = enrolledCourses.filter(enrollment =>
    enrollment.courses.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.courses.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="animate-pulse flex items-center space-x-2 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-center">
        <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2 sm:mb-3" />
        <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1">No Enrolled Courses</h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">You haven&apos;t enrolled in any courses yet</p>
        <button
          onClick={() => window.location.href = '/workspace/explore'}
          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-xs sm:text-sm"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 sm:p-3 rounded-lg transition-colors group"
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            selectedEnrollment ? getProgressBgColor(getProgressPercentage(selectedEnrollment)) : 'bg-gray-100'
          }`}>
            {selectedEnrollment && getProgressPercentage(selectedEnrollment) === 100 ? (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            ) : (
              <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${
                selectedEnrollment ? getProgressColor(getProgressPercentage(selectedEnrollment)) : 'text-gray-400'
              }`} />
            )}
          </div>
          
          <div className="flex-1 text-left min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
              {selectedEnrollment?.courses.name || 'Select a course'}
            </h3>
            {selectedEnrollment && (
              <div className="flex items-center space-x-2 sm:space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                    getProgressPercentage(selectedEnrollment) === 100 ? 'bg-green-500' : 'bg-indigo-500'
                  }`}></div>
                  <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {getProgressPercentage(selectedEnrollment)}%
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">•</span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {selectedEnrollment.courses.level}
                </span>
              </div>
            )}
          </div>
          
          <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform group-hover:text-gray-600 dark:group-hover:text-gray-300 flex-shrink-0 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg z-50 max-h-[80vh] sm:max-h-96 overflow-hidden">
          <div className="p-2 sm:p-3 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto">
            {filteredCourses.length === 0 ? (
              <div className="p-4 sm:p-6 text-center">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No courses found</p>
              </div>
            ) : (
              filteredCourses.map((enrollment) => {
                const progressPercentage = getProgressPercentage(enrollment);
                const isSelected = selectedEnrollment?.enrollCourse.id === enrollment.enrollCourse.id;
                
                return (
                  <button
                    key={enrollment.enrollCourse.id}
                    onClick={() => {
                      onEnrollmentChange(enrollment);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full p-3 sm:p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-indigo-200' : getProgressBgColor(progressPercentage)
                      }`}>
                        {progressPercentage === 100 ? (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        ) : (
                          <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 ${
                            isSelected ? 'text-indigo-700' : getProgressColor(progressPercentage)
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-1 truncate">
                          {enrollment.courses.name}
                        </h4>
                        
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                          <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${
                            enrollment.courses.level === 'beginner' ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' :
                            enrollment.courses.level === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400' :
                            enrollment.courses.level === 'advanced' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}>
                            {enrollment.courses.level}
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {enrollment.courses.noOfChapters} chapters
                          </span>
                          {enrollment.courses.category && (
                            <>
                              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">•</span>
                              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                                {enrollment.courses.category}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 sm:h-2 mb-1.5 sm:mb-2">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full transition-all ${getProgressBarColor(progressPercentage)}`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                            {enrollment.enrollCourse.completedChapters?.length || 0} of {enrollment.courses.noOfChapters} completed
                          </span>
                          <div className="flex items-center space-x-0.5 sm:space-x-1">
                            {progressPercentage === 100 && (
                              <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
                            )}
                            <span className={`text-[10px] sm:text-xs font-semibold ${getProgressColor(progressPercentage)}`}>
                              {progressPercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-1.5 sm:mt-2">
                          <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                            progressPercentage === 100 ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                            progressPercentage >= 50 ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                            progressPercentage > 0 ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {progressPercentage === 100 && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />}
                            {progressPercentage === 100 ? 'Completed' :
                             progressPercentage >= 50 ? 'In Progress' :
                             progressPercentage > 0 ? 'Started' :
                             'Not Started'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} enrolled
            </p>
          </div>
        </div>
      )}

      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
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
    return 'text-purple-600';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 70) return 'bg-blue-100';
    if (percentage >= 40) return 'bg-yellow-100';
    return 'bg-purple-100';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  const filteredCourses = enrolledCourses.filter(enrollment =>
    enrollment.courses.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.courses.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-4 bg-[#FFFFFF] border-b border-gray-200">
        <div className="animate-pulse flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="p-6 bg-[#FFFFFF] border-b border-gray-200 text-center">
        <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="font-medium text-gray-900 mb-1">No Enrolled Courses</h3>
        <p className="text-sm text-gray-500 mb-4">You haven&apos;t enrolled in any courses yet</p>
        <button
          onClick={() => window.location.href = '/workspace/explore'}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
        >
          Explore Courses
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="p-4 bg-[#FFFFFF] border-b border-gray-200">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center space-x-3 hover:bg-gray-50 p-3 rounded-lg transition-colors group"
        >
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            selectedEnrollment ? getProgressBgColor(getProgressPercentage(selectedEnrollment)) : 'bg-gray-100'
          }`}>
            {selectedEnrollment && getProgressPercentage(selectedEnrollment) === 100 ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <BookOpen className={`w-6 h-6 ${
                selectedEnrollment ? getProgressColor(getProgressPercentage(selectedEnrollment)) : 'text-gray-400'
              }`} />
            )}
          </div>
          
          <div className="flex-1 text-left min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {selectedEnrollment?.courses.name || 'Select a course'}
            </h3>
            {selectedEnrollment && (
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    getProgressPercentage(selectedEnrollment) === 100 ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-xs text-gray-600 font-medium">
                    {getProgressPercentage(selectedEnrollment)}%
                  </span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 capitalize">
                  {selectedEnrollment.courses.level}
                </span>
              </div>
            )}
          </div>
          
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform group-hover:text-gray-600 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} />
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#FFFFFF] border-b border-gray-200 shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredCourses.length === 0 ? (
              <div className="p-6 text-center">
                <Search className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">No courses found</p>
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
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      isSelected ? 'bg-purple-50 border-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-purple-200' : getProgressBgColor(progressPercentage)
                      }`}>
                        {progressPercentage === 100 ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <BookOpen className={`w-6 h-6 ${
                            isSelected ? 'text-purple-700' : getProgressColor(progressPercentage)
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1 truncate">
                          {enrollment.courses.name}
                        </h4>
                        
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            enrollment.courses.level === 'beginner' ? 'bg-green-100 text-green-700' :
                            enrollment.courses.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            enrollment.courses.level === 'advanced' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {enrollment.courses.level}
                          </span>
                          <span className="text-xs text-gray-500">
                            {enrollment.courses.noOfChapters} chapters
                          </span>
                          {enrollment.courses.category && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {enrollment.courses.category}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressBarColor(progressPercentage)}`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">
                            {enrollment.enrollCourse.completedChapters?.length || 0} of {enrollment.courses.noOfChapters} completed
                          </span>
                          <div className="flex items-center space-x-1">
                            {progressPercentage === 100 && (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                            <span className={`text-xs font-semibold ${getProgressColor(progressPercentage)}`}>
                              {progressPercentage}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            progressPercentage === 100 ? 'bg-green-100 text-green-800' :
                            progressPercentage >= 50 ? 'bg-blue-100 text-blue-800' :
                            progressPercentage > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {progressPercentage === 100 && <CheckCircle className="w-3 h-3 mr-1" />}
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

          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} enrolled
            </p>
          </div>
        </div>
      )}

      {isDropdownOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}
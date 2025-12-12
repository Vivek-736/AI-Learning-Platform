'use client';

import React, { useState, useEffect } from 'react';
import ExploreCourseCard from '@/components/ExploreCourseCard';
import { Search, Filter, Sparkles, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';

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

const ExploreCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, [refreshTrigger]);

  useEffect(() => {
    filterCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, searchTerm, selectedLevel, selectedCategory]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/courses/all');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.courseJson?.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseJson?.course?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level?.toLowerCase() === selectedLevel.toLowerCase());
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    setFilteredCourses(filtered);
  };

  const handleEnrollSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const getUniqueCategories = () => {
    const categories = courses
      .map(course => course.category)
      .filter(category => category && category.trim() !== '')
      .filter((category, index, array) => array.indexOf(category) === index);
    return categories;
  };

  const getUniqueLevels = () => {
    const levels = courses
      .map(course => course.level)
      .filter(level => level && level.trim() !== '')
      .filter((level, index, array) => array.indexOf(level) === index);
    return levels;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#09090b]">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center mb-8 sm:mb-12 animate-pulse">
            <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-800 rounded w-full max-w-xs sm:max-w-sm mx-auto mb-4"></div>
            <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-800 rounded w-full max-w-md sm:max-w-lg mx-auto"></div>
          </div>

          <div className="mb-6 sm:mb-8 animate-pulse">
            <div className="flex flex-col sm:flex-col md:flex-row gap-3 sm:gap-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full md:w-80"></div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full sm:w-32"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full sm:w-32"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="w-full h-40 sm:h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                  <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b]">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              Explore Courses
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Discover amazing courses created by our community. Learn new skills, advance your career, and unlock your potential.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-500" />
              <span>{courses.length} courses available</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900 dark:text-gray-100" />
              <span>Updated daily</span>
            </div>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-gray-400 dark:focus:border-gray-600 focus:ring-gray-200 dark:focus:ring-gray-700 w-full placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="hidden sm:flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
              </div>
              
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Levels</SelectItem>
                  {getUniqueLevels().map(level => (
                    <SelectItem key={level} value={level.toLowerCase()} className="text-gray-900 dark:text-gray-100">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-36 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Categories</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category!.toLowerCase()} className="text-gray-900 dark:text-gray-100">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || selectedLevel !== 'all' || selectedCategory !== 'all') && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">×</button>
                </Badge>
              )}
              {selectedLevel !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                  Level: {selectedLevel}
                  <button onClick={() => setSelectedLevel('all')} className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">×</button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">×</button>
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('all');
                  setSelectedCategory('all');
                }}
                className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredCourses.length}</span> 
            {filteredCourses.length === 1 ? ' course' : ' courses'}
            {(searchTerm || selectedLevel !== 'all' || selectedCategory !== 'all') && ' matching your filters'}
          </p>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <ExploreCourseCard 
                key={course.cid} 
                course={course} 
                onEnrollSuccess={handleEnrollSuccess}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No courses found</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              Try adjusting your search terms or filters to find more courses.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('all');
                setSelectedCategory('all');
              }}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm sm:text-base"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreCourses;

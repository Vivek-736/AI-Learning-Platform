'use client';

import React from 'react';
import { Bot, BookOpen, TrendingUp, Target, Lightbulb } from 'lucide-react';

export default function AssistantWelcome() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#FFFFFF]">
      <div className="text-center max-w-2xl mx-auto px-6">
        <div className="relative mb-8 mt-1">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto">
            <Bot className="w-12 h-12 text-indigo-600" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your AI Learning Assistant
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          I&apos;m your personalized learning companion! Select one of your enrolled courses to get started. 
          I&apos;ll provide tailored assistance based on your progress and help you succeed in your learning journey.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-left border border-indigo-200">
            <div className="w-10 h-10 bg-indigo-200 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-indigo-900 mb-2">Course Content Help</h3>
            <p className="text-sm text-indigo-800 leading-relaxed">
              Get explanations of course concepts, clarify doubts, and dive deeper into topics you&apos;re studying.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-left border border-blue-200">
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Progress Tracking</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              I know exactly where you are in each course and can provide personalized recommendations for next steps.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-left border border-green-200">
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Personalized Learning</h3>
            <p className="text-sm text-green-800 leading-relaxed">
              Each enrollment gets its own assistant experience tailored to your specific learning journey and progress.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-left border border-orange-200">
            <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-900 mb-2">Smart Suggestions</h3>
            <p className="text-sm text-orange-800 leading-relaxed">
              Get intelligent recommendations based on your completed chapters, quiz performance, and study patterns.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-3 text-center">What I can help with:</h3>
          <div className="space-y-2">
            {[
              'Explain course concepts and materials',
              'Track your learning progress',
              'Suggest next steps based on completed chapters',
              'Answer questions about your specific enrollment',
              'Provide personalized study recommendations',
              'Help with quiz preparation and review'
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">
            👆 Select a course from the sidebar to start chatting with your AI assistant
          </p>
        </div>
      </div>
    </div>
  );
}
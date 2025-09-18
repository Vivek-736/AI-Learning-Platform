"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  MessageCircleQuestion, 
  Mic, 
  Brain, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Star
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Notes Generation",
      description: "AI transforms your lectures into comprehensive, organized notes instantly."
    },
    {
      icon: <MessageCircleQuestion className="h-8 w-8" />,
      title: "Doubt Solving",
      description: "Get instant answers to your questions with detailed explanations."
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Interviews",
      description: "Practice with AI-powered mock interviews and receive instant feedback."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Quizzes & Flashcards",
      description: "Adaptive learning materials that adjust to your progress and understanding."
    }
  ];

  const steps = [
    {
      icon: <MessageCircleQuestion className="h-12 w-12" />,
      title: "Ask",
      description: "Upload your content or ask questions about any topic"
    },
    {
      icon: <Brain className="h-12 w-12" />,
      title: "Learn",
      description: "AI processes and delivers personalized learning materials"
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Grow",
      description: "Track progress and master concepts with adaptive learning"
    }
  ];

  const testimonials = [
    {
      text: "EruditeAI transformed how I study. My grades improved by 40% in just one semester!",
      author: "Sarah Chen",
      role: "Computer Science Student"
    },
    {
      text: "The voice interviews feature helped me land my dream internship. The feedback was incredibly detailed.",
      author: "Marcus Johnson",
      role: "Business Major"
    },
    {
      text: "I love how it turns my messy lecture recordings into perfect study notes. It's like having a personal AI tutor.",
      author: "Emily Rodriguez",
      role: "Pre-Med Student"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      
      <section id="hero" className="relative overflow-hidden pt-32 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Learning Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                Learn Smarter
                <span className="block text-purple-600">with AI.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                Notes, doubts, interviews, quizzes & flashcards — all powered by AI.
              </p>
              
              <Button className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 glow-purple">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Free trial with one course generation
              </p>
            </div>
            
            <div className="flex-1 relative">
              <div className="relative w-full max-w-lg mx-auto">
                <Image
                  src="/hero.jpg"
                  alt="AI-powered learning platform"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                  priority
                />
                <div className="absolute -top-4 -right-4 bg-purple-600 text-white p-4 rounded-full shadow-lg animate-pulse">
                  <Brain className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience learning like never before with our suite of AI-powered tools designed to accelerate your academic success.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className="text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your AI-powered learning journey in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 text-purple-600 rounded-full mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full">
                      <ArrowRight className="h-6 w-6 text-gray-300 mx-auto" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Student Voices
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students already learning smarter with EruditeAI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                    &quot;{testimonial.text}&quot;
                  </blockquote>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <p className="font-semibold text-black">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Start Learning
              <span className="block text-purple-400">Smarter Today</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join over 50,000 students who have transformed their learning with EruditeAI. 
              Your academic success story starts here. With one course generation for free
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
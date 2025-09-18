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
  Star,
  Users,
  Award,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const stepsInView = useInView(stepsRef, { once: true, amount: 0.1 });
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.1,
  });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Smart Notes Generation",
      description:
        "Transform lectures into comprehensive, organized notes with AI-powered summarization and key concept extraction.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MessageCircleQuestion className="h-8 w-8" />,
      title: "Instant Doubt Resolution",
      description:
        "Get detailed explanations for complex concepts with step-by-step breakdowns and visual aids.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "AI Voice Interviews",
      description:
        "Practice with realistic mock interviews featuring dynamic questions and real-time feedback analysis.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Adaptive Learning",
      description:
        "Personalized quizzes and flashcards that evolve with your learning pace and comprehension level.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const steps = [
    {
      icon: <MessageCircleQuestion className="h-12 w-12" />,
      title: "Upload & Ask",
      description:
        "Share your content, recordings, or questions about any academic topic",
      delay: 0,
    },
    {
      icon: <Brain className="h-12 w-12" />,
      title: "AI Processing",
      description:
        "Advanced algorithms analyze and create personalized learning materials",
      delay: 0.2,
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: "Track & Master",
      description:
        "Monitor progress and achieve mastery with intelligent feedback loops",
      delay: 0.4,
    },
  ];

  const testimonials = [
    {
      text: "EruditeAI completely revolutionized my study routine. My GPA jumped from 3.2 to 3.8 in just one semester!",
      author: "Sarah Chen",
      role: "Computer Science Student",
      university: "Stanford University",
      image: "/testimonial1.jpg",
    },
    {
      text: "The voice interview feature is incredible. I practiced 50+ interviews and landed offers from 3 top tech companies.",
      author: "Marcus Johnson",
      role: "Business Major",
      university: "Harvard Business School",
      image: "/testimonial2.jpg",
    },
    {
      text: "From messy lecture recordings to perfect study guides in minutes. It's like having a genius study partner 24/7.",
      author: "Emily Rodriguez",
      role: "Pre-Med Student",
      university: "Johns Hopkins",
      image: "/testimonial3.jpg",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Active Students",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "98%",
      label: "Success Rate",
      icon: <Award className="h-6 w-6" />,
    },
    {
      number: "2M+",
      label: "Notes Generated",
      icon: <BookOpen className="h-6 w-6" />,
    },
    { number: "24/7", label: "AI Support", icon: <Zap className="h-6 w-6" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 text-black overflow-x-hidden">
      <Header />
      <section ref={heroRef} className="relative pt-32 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-4 w-4" />
                AI-Powered Learning Revolution
              </motion.div>

              <motion.h1
                className="text-5xl lg:text-8xl font-black leading-none mb-8"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
              >
                <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-purple-600 bg-clip-text text-transparent">
                  Learn
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Smarter
                </span>
                <br />
                <span className="text-gray-900">with AI.</span>
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed max-w-2xl"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
              >
                Transform your learning experience with AI-powered notes,
                instant doubt resolution, voice interviews, and adaptive
                quizzes. Your academic success starts here.
              </motion.p>

              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
              >
                <Link href={"/workspace"}>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 20px 25px -5px rgba(147, 51, 234, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-gradient-to-r cursor-pointer from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl shadow-purple-500/30 border-0 group">
                      Start Learning Free
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free trial included
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  No credit card required
                </div>
              </motion.div>
            </motion.div>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <motion.div className="flex-1 relative" variants={itemVariants}>
              <motion.div
                className="relative w-full max-w-lg mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <Image
                  src="/hero.jpg"
                  alt="AI-powered learning platform"
                  width={600}
                  height={300}
                  className="relative rounded-3xl shadow-2xl shadow-purple-500/20 border border-white/20"
                  priority
                />
                <motion.div
                  className="absolute -top-6 -right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl"
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Brain className="h-8 w-8" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white text-purple-600 p-4 rounded-xl shadow-lg border border-purple-100"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <Sparkles className="h-6 w-6" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        ref={statsRef}
        className="py-16 bg-white/50 backdrop-blur-sm border-y border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={featuresRef}
        className="py-24 bg-gradient-to-b from-transparent to-gray-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-5xl lg:text-7xl font-black mb-6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Powered by
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Advanced AI
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              Experience the future of learning with our cutting-edge AI tools
              designed to accelerate your academic journey and unlock your full
              potential.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
                whileHover="hover"
              >
                <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden h-full">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />
                  <CardContent className="p-8 relative z-10">
                    <motion.div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    variants={cardHoverVariants}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={stepsRef}
        className="py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-5xl lg:text-7xl font-black mb-6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                How It
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Works
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              Start your AI-powered learning journey in three simple steps and
              watch your academic performance soar
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center group relative"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
                custom={step.delay}
              >
                <div className="relative mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-full mb-6 shadow-lg group-hover:shadow-xl transition-all duration-500"
                    whileHover={{
                      scale: 1.1,
                      background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    }}
                  >
                    <motion.div
                      whileHover={{ color: "#ffffff" }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.icon}
                    </motion.div>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden md:block absolute top-12 left-full w-full"
                      initial={{ scaleX: 0 }}
                      animate={stepsInView ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                    >
                      <div className="flex justify-center">
                        <ArrowRight className="h-6 w-6 text-purple-300" />
                      </div>
                    </motion.div>
                  )}
                </div>
                <motion.h3
                  className="text-2xl font-bold mb-4 group-hover:text-purple-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-gray-600 text-lg leading-relaxed"
                  whileHover={{ scale: 1.02 }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={testimonialsRef}
        className="py-24 bg-gradient-to-b from-white to-purple-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            variants={containerVariants}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
          >
            <motion.h2
              className="text-5xl lg:text-7xl font-black mb-6"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Student
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Success Stories
              </span>
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={itemVariants}
            >
              Join thousands of students who have transformed their academic
              journey with EruditeAI
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={itemVariants}
                whileHover="hover"
              >
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group h-full">
                  <CardContent className="p-8">
                    <motion.div
                      className="flex mb-6"
                      whileHover={{ scale: 1.05 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>
                    <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed italic">
                      &quot;{testimonial.text}&quot;
                    </blockquote>
                    <div className="border-l-4 border-gradient-to-b from-purple-600 to-pink-600 pl-4">
                      <p className="font-bold text-black">
                        {testimonial.author}
                      </p>
                      <p className="text-purple-600 font-semibold">
                        {testimonial.role}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.university}
                      </p>
                    </div>
                  </CardContent>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    variants={cardHoverVariants}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-purple-900 via-purple-800 to-pink-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl lg:text-8xl font-black mb-8 leading-none"
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: "linear-gradient(90deg, #ffffff, #fbbf24, #ffffff)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Start Learning
              <br />
              Smarter Today
            </motion.h2>
            <motion.p
              className="text-xl text-purple-100 mb-12 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Join over 50,000 students who have transformed their learning with
              EruditeAI. Your academic success story starts here with one free
              course generation.
            </motion.p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={"/workspace"}>
                <Button className="bg-white cursor-pointer text-purple-900 hover:bg-purple-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500">
                  Begin Your Journey
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-300/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-yellow-300/20 rounded-full animate-ping"></div>
      </section>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;
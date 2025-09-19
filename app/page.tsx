"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Youtube,
  Mic,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <motion.nav
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="font-bold text-xl text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={"/favicon.png"}
                alt="EruditeAI Logo"
                width={36}
                height={36}
                className="inline-block mr-2 mb-1"
              />
              EruditeAI
            </motion.div>
            <div className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
              >
                How it works
              </a>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={"/workspace"}>
                <Button className="bg-purple-600 text-white hover:bg-purple-700 cursor-pointer transition-all duration-200 rounded-full px-6">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Rated 5 by Vivek</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-6 leading-tight text-gray-900">
                Learn Smarter
                <br />
                <span>with AI</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                Transform any content into personalized flashcards, intelligent
                notes, and interactive voice interviews. Your AI-powered
                learning companion.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={"/workspace"}>
                    <Button
                      size="lg"
                      className="bg-gray-900 cursor-pointer text-white hover:bg-gray-800 px-8 py-3 rounded-full"
                    >
                      Start Learning Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={"/workspace"}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-gray-300 cursor-pointer md:block hidden hover:bg-gray-100 px-8 py-3 rounded-full"
                    >
                      Watch Demo
                    </Button>
                  </Link>
                </motion.div>
              </div>

              <div className="md:flex hidden items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>10k+ active learners (Forthcoming)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>3x faster learning</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="relative">
                <motion.div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Learning Dashboard
                    </h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            AI Flashcards
                          </div>
                          <div className="text-xs text-gray-500">
                            124 cards generated
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        98% accuracy
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <Youtube className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            YouTube Notes
                          </div>
                          <div className="text-xs text-gray-500">
                            45 videos processed
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        12h saved
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Mic className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Voice Interviews
                          </div>
                          <div className="text-xs text-gray-500">
                            23 sessions completed
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        +15% retention
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Weekly Progress</span>
                      <span className="font-semibold text-gray-900">+24%</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-indigo-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "74%" }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-gray-100"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">
                      AI Learning Active
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4 text-gray-900">
              Three Powerful Tools
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey, powered
              by AI
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="p-8 h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                <motion.div
                  className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  AI Flashcards
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Instantly generate smart flashcards from any content. Our AI
                  understands context and creates meaningful questions for
                  optimal retention.
                </p>
                <motion.a
                  href="#"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200 font-medium"
                  whileHover={{ x: 5 }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </motion.a>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                <motion.div
                  className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Youtube className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  YouTube Notes
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Transform any YouTube video into structured notes. AI extracts
                  key concepts, timestamps, and creates searchable summaries.
                </p>
                <motion.a
                  href="#"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200 font-medium"
                  whileHover={{ x: 5 }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </motion.a>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-8 h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-gray-50 to-white">
                <motion.div
                  className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mic className="h-6 w-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-medium mb-4 text-gray-900">
                  Voice Interviews
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Practice with AI-powered voice interviews. Get personalized
                  questions, instant feedback, and improve your understanding
                  through conversation.
                </p>
                <motion.a
                  href="#"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200 font-medium"
                  whileHover={{ x: 5 }}
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </motion.a>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-white rounded-2xl shadow-sm"
            >
              <div className="text-4xl font-light mb-2 text-gray-900">10k+</div>
              <div className="text-gray-600">Flashcards Generated</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-white rounded-2xl shadow-sm"
            >
              <div className="text-4xl font-light mb-2 text-gray-900">5k+</div>
              <div className="text-gray-600">Videos Processed</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-white rounded-2xl shadow-sm"
            >
              <div className="text-4xl font-light mb-2 text-gray-900">98%</div>
              <div className="text-gray-600">Learning Improvement</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-20 px-4 bg-gray-900 text-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-6">
            Ready to revolutionize
            <br />
            your learning?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have already transformed their study
            habits with AI
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={"/workspace"}>
              <Button
                size="lg"
                className="bg-white cursor-pointer text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <footer className="py-6 px-4 bg-white border-t border-gray-100">
        <div className="flex items-center justify-center">
          <p className="md:text-sm text-xs">
            © 2025 EruditeAI - Made with ❤️ by Vivek
          </p>
        </div>
      </footer>
    </div>
  );
}
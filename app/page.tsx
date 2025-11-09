"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Brain, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import { Schibsted_Grotesk } from "next/font/google";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  style: "italic",
});

const nohemi = localFont({
  src: [
    {
      path: "../public/fonts/nohemi/Nohemi-Thin-BF6438cc5896c67.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-ExtraLight-BF6438cc58a2634.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Light-BF6438cc5899919.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-ExtraBold-BF6438cc5881baf.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/nohemi/Nohemi-Black-BF6438cc58744d4.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

export default function Home() {
  const { user } = useUser();
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`min-h-screen md:overflow-auto overflow-x-hidden bg-white ${nohemi.variable}`}>
      <nav className="fixed top-0 left-0 px-4 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-12">
              <Link
                href="#features"
                onClick={scrollToFeatures}
                className={`text-base text-gray-900 hover:text-black-600 transition-colors cursor-pointer ${nohemi.className} font-medium tracking-wide`}
              >
                Features
              </Link>
              <Link
                href="/workspace/billing"
                className={`text-base text-gray-900 md:block hidden hover:text-black-600 transition-colors ${nohemi.className} font-medium tracking-wide`}
              >
                Pricing
              </Link>
            </div>

            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <h1
                className={`md:text-3xl text-sm font-bold tracking-wider ${nohemi.className}`}
              >
                Fascinity
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/workspace">
                <Button className="bg-black hover:bg-black-900 cursor-pointer text-white md:px-6 rounded-md transition-colors duration-200">
                  {user ? "Dashboard" : "LogIn"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-12 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1
            className={` ${instrumentSerif.className} instrument-serif-regular-italic text-7xl md:text-9xl italic text-gray-900 text-center mb-12 leading-tight font-light`}
          >
            Learning, Reimagined
          </h1>

          <div className="px-4">
            <div className="max-w-3xl md:-mb-10">
              <p
                className={`text-lg md:text-xl text-gray-700 leading-relaxed ${schibstedGrotesk.className} font-normal`}
              >
                <span
                  className={`text-black-600 font-bold`}
                >
                  ✦✦✦
                </span>
                Empowering every student to achieve their learning goals through
                personalized, AI-driven tools designed for seamless integration
                with higher education.
              </p>
            </div>

            <div className="mb-16 flex md:mt-0 mt-2 md:mr-14 justify-end">
              <Link href="/workspace">
                <Button className="bg-black hover:bg-black-900 cursor-pointer text-white px-8 py-3 text-base rounded-md transition-colors duration-200">
                  Start Learning Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl border-2 border-black-200 rounded-xl bg-black">
            <div className="relative group overflow-hidden rounded-3xl bg-black shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/hero1.png"
                  alt="Reading book with green illustration"
                  fill
                  className="object-cover opacity-80"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="absolute top-6 left-6">
                <p className="text-white text-lg font-light leading-relaxed">
                  No more hours of reading
                  <br />
                  and figuring out
                </p>
              </div>

              <div className="absolute bottom-6 right-6">
                <p className="text-white text-lg font-serif italic">
                  It&apos;s{" "}
                  <span className="font-normal text-black-300">simple</span> now
                </p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-3xl bg-black shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/hero2.png"
                  alt="Student studying at desk"
                  fill
                  className="object-cover opacity-80"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <div className="absolute top-6 right-6">
                <p className="text-white text-lg font-light">
                  no more <span className="italic">hours</span> of{" "}
                  <span className="text-red-400 italic font-serif">
                    mindlessness
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-white via-black-50/30 to-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-12">
            <div
              className={`inline-flex items-center space-x-3 text-sm font-semibold text-gray-900 ${nohemi.className} tracking-wider`}
            >
              <span className="text-black-600">✦</span>
              <span>AI-Learning management System</span>
              <span className="text-black-600">✦</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2
              className={`text-5xl md:text-6xl lg:text-7xl italic text-gray-900 mb-6 leading-tight font-light ${instrumentSerif.className}`}
            >
              An AI Driven
            </h2>
            <h2
              className={`text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-12 leading-tight ${nohemi.className}`}
            >
              <span>self-learning</span> platform
            </h2>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <svg
                width="180"
                height="100"
                viewBox="0 0 180 100"
                className="transform -rotate-12"
              >
                <ellipse
                  cx="90"
                  cy="50"
                  rx="80"
                  ry="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-black-400"
                />
                <circle
                  cx="90"
                  cy="10"
                  r="3"
                  fill="currentColor"
                  className="text-black-600"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="3"
                  fill="currentColor"
                  className="text-black-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-medium text-gray-900 tracking-wider">
                  FOR
                </span>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h3 className={`${instrumentSerif.className} text-4xl md:text-5xl lg:text-6xl font-serif italic text-gray-900 leading-tight`}>
              People who <span className="text-black-600">Break</span> Tradition
            </h3>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              We&apos;re dismantling the rigid, one-size-fits-all classroom
              model by replacing static lectures and generic textbooks with
              AI-powered personalized learning that adapts in real-time to each
              student&apos;s unique pace, style, and needs.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
              <span className="text-black-600">✦</span>
              <span>In Your way of Learning</span>
              <span className="text-black-600">✦</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-14 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                AI-Powered
                <br />
                <span className="text-black-600">Course</span> Generation
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Transform any topic into comprehensive learning experiences with
                our advanced AI course generation engine. Simply input your
                subject matter, learning objectives, and target audience.
              </p>
              <p className="text-base text-gray-600 italic leading-relaxed">
                watch as our platform creates structured curricula complete with
                lesson plans, interactive content, and assessments
              </p>
            </div>

            <div className="relative flex items-center md:ml-8 justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/A.png"
                  alt="AI-Powered Course Generation"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <motion.section
        id="features"
        className="py-20 px-6 lg:px-8 bg-gray-50 scroll-mt-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI-Learning and{" "}
              <span className="text-black-600">Self-Assessment</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-black-100 hover:border-black-300 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center bg-black-50 rounded-full">
                <Brain className="w-10 h-10 text-black-600" strokeWidth={1} />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">
                Quiz Generator
              </h3>

              <p className="text-base text-gray-600 mb-8 leading-relaxed flex-grow">
                Generate AI-powered quizzes from your courses
              </p>

              <Link href="/workspace/ai-tools/quiz">
                <Button className="bg-black hover:bg-black-900 cursor-pointer text-white px-8 py-3 rounded-md w-full transition-colors duration-200">
                  Get started
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-black-100 hover:border-black-300 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center bg-black-50 rounded-full">
                <svg
                  className="w-10 h-10 text-black-600"
                  viewBox="0 0 80 80"
                  fill="none"
                >
                  <rect
                    x="15"
                    y="20"
                    width="50"
                    height="40"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <text
                    x="25"
                    y="35"
                    fontSize="16"
                    fontWeight="bold"
                    fill="currentColor"
                  >
                    Aa
                  </text>
                  <line
                    x1="20"
                    y1="45"
                    x2="60"
                    y2="45"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="20"
                    y1="50"
                    x2="55"
                    y2="50"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="20"
                    y1="55"
                    x2="50"
                    y2="55"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">
                Flashcards
              </h3>

              <p className="text-base text-gray-600 mb-8 leading-relaxed flex-grow">
                Create smart flashcards for better learning
              </p>

              <Link href="/workspace/ai-tools/flashcard">
                <Button className="bg-black hover:bg-black-900 cursor-pointer text-white px-8 py-3 rounded-md w-full transition-colors duration-200">
                  Get started
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-black-100 hover:border-black-300 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center bg-black-50 rounded-full">
                <Mic className="w-10 h-10 text-black-600" strokeWidth={1} />
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">
                Voice Interview
              </h3>

              <p className="text-base text-gray-600 mb-8 leading-relaxed flex-grow">
                Practice interviews with AI feedback
              </p>

              <Link href="/workspace/ai-tools/interview">
                <Button className="bg-black hover:bg-black-900 cursor-pointer text-white px-8 py-3 rounded-md w-full transition-colors duration-200">
                  Get started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="py-20 px-6 lg:px-8 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-5xl md:text-6xl font-serif font-light mb-8 leading-tight">
                Why Choose
                <br />
                <span className="text-black-300">Fascinity</span>
              </h2>
            </div>

            <div className="flex justify-end items-start">
              <Link href="/workspace">
                <Button
                  variant="outline"
                  className="text-black hover:text-slate-900 cursor-pointer"
                >
                  Start Learning Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="max-w-4xl">
            <p className="text-2xl md:text-3xl font-light leading-relaxed">
              Unlike generic platforms, we&apos;re designed specifically for
              higher education with deep curriculum integration and academic
              focus.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-16">
            <Image
              src="/favicon.png"
              alt="Fascinity Logo"
              className="bg-black rounded-2xl"
              width={120}
              height={120}
            />

            <h2 className="text-4xl md:text-9xl font-bold text-gray-900">
              <span className={`bg-gradient-to-r font-normal from-gray-900 via-black-600 to-gray-900 bg-clip-text text-transparent ${nohemi.className}`}>
                Fascinity
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-6xl mx-auto mb-16">
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                what we are?
              </p>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-tight">
                An AI-<span className="text-black-600">LMS</span>
              </h3>
            </div>

            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                What we do?
              </p>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-tight">
                <span className="text-black-600">Transform</span>
              </h3>
            </div>

            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                What do we envision?
              </p>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-tight">
                A <span className="text-black-600">Better</span>
                <br />
                Tomorrow
              </h3>
            </div>

            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                what we deliver
              </p>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-tight">
                <span className="text-black-600">Quality</span>
                <br />
                content
              </h3>
            </div>

            <div className="text-center md:block hidden">
              <p className="text-xs md:text-sm text-gray-500 mb-2">
                what&apos;re we Breaking
              </p>
              <h3 className="text-lg md:text-xl font-serif text-gray-900 leading-tight">
                <span className="text-black-600">Traditional</span>
                <br />
                classrooms
              </h3>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/workspace">
              <Button className="bg-black hover:bg-black-900 cursor-pointer text-white px-8 py-3 rounded-md text-base transition-colors duration-200">
                Start Learning Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-8 px-6 lg:px-8 border-t border-black-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>
                © 2025 Fascinity. All educational and general purposes only 2025
              </p>
              <Link
                href="/privacy"
                className="hover:text-black-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="text-sm text-gray-400 flex items-center space-x-2">
              <span>Learn with AI</span>
              <span className="text-lg text-black-600">✦</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="/"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </Link>
              <Link
                href="/"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="text-right mt-6">
            <p className="text-xs text-gray-500">
              All rights reserved. All wrongs reversed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
  ];

  const headerVariants = {
    initial: {
      backgroundColor: "rgba(255, 255, 255, 0)",
      backdropFilter: "blur(0px)",
      borderColor: "rgba(0, 0, 0, 0)",
      boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
    },
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderColor: "rgba(147, 51, 234, 0.1)",
      boxShadow: "0 8px 32px -8px rgba(147, 51, 234, 0.15)",
    },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    tap: { scale: 0.95 },
  };

  const navItemVariants = {
    initial: { opacity: 0.8, y: 0 },
    hover: {
      opacity: 1,
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const mobileNavItemVariants = {
    closed: { opacity: 0, x: -20, scale: 0.95 },
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(147, 51, 234, 0.4)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500"
        variants={headerVariants}
        initial="initial"
        animate={isScrolled ? "scrolled" : "initial"}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer group"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                className="relative"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Image
                  src="/favicon.png"
                  alt="EruditeAI Logo"
                  width={40}
                  height={40}
                  className="relative z-10"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 blur-sm"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <motion.span
                className="text-2xl font-black bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent"
                whileHover={{
                  background:
                    "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                  backgroundSize: "200% 100%",
                }}
              >
                EruditeAI
              </motion.span>
              <motion.div
                className="ml-1"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              >
                <Sparkles className="h-4 w-4 text-purple-500" />
              </motion.div>
            </motion.div>

            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-700 font-semibold text-sm tracking-wide group"
                  variants={navItemVariants}
                  initial="initial"
                  whileHover="hover"
                  custom={index}
                >
                  <span className="relative z-10 group-hover:text-purple-600 transition-colors duration-300">
                    {item.name}
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 origin-left"
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileHover={{
                      scaleX: 1,
                      opacity: 1,
                      transition: { duration: 0.3, ease: "easeOut" },
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-purple-50 rounded-lg -z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{
                      scale: 1,
                      opacity: 1,
                      transition: { duration: 0.2 },
                    }}
                  />
                </motion.a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/workspace">
                <motion.button
                  className="text-gray-700 cursor-pointer hover:text-purple-600 font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(147, 51, 234, 0.05)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/workspace">
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 cursor-pointer text-white px-6 py-2.5 rounded-xl font-bold shadow-lg border-0 group relative overflow-hidden">
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </div>

            <motion.button
              className="lg:hidden p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className="lg:hidden overflow-hidden"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <motion.div className="py-6 space-y-2 bg-white/95 backdrop-blur-xl rounded-2xl mt-4 border border-purple-100 shadow-2xl">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="block px-6 py-3 text-gray-700 font-semibold hover:text-purple-600 hover:bg-purple-50 rounded-lg mx-4 transition-all duration-300"
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      variants={mobileNavItemVariants}
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {item.name}
                      </motion.div>
                    </motion.a>
                  ))}

                  <motion.div
                    className="px-6 pt-4 space-y-3"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    variants={mobileNavItemVariants}
                  >
                    <Link href="/workspace">
                      <motion.button
                        className="w-full text-center py-3 text-gray-700 font-semibold hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </motion.button>
                    </Link>
                    <Link href="/workspace">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-bold shadow-lg group relative overflow-hidden"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="relative z-10 flex items-center justify-center">
                            Get Started Free
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
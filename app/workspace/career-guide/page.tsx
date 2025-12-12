"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import localFont from "next/font/local";

const nohemi = localFont({
  src: [
    {
      path: "../../../public/fonts/nohemi/Nohemi-Regular-BF6438cc4d0e493.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CareerGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 **Welcome to your AI Career Guide!**\n\nI'm here to help you discover the perfect learning path for your career goals. Tell me about your interests, current skills, or career aspirations, and I'll suggest relevant courses and guide you through your learning journey!\n\n✨ *What would you like to explore today?*",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/career-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I encountered an error. Please try again or refresh the conversation.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] ${nohemi.variable} bg-white dark:bg-[#09090b]`}>
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-white dark:bg-[#09090b]">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-2 sm:space-x-3 mb-4 sm:mb-6 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white dark:text-gray-900" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div
                    className={`prose prose-sm max-w-none ${
                      message.role === "user"
                        ? `text-white dark:text-gray-900 ${nohemi.className}`
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className={`${nohemi.className} font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-2 sm:mb-3`}>
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className={`${nohemi.className} font-semibold text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-1.5 sm:mb-2`}>
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className={`${nohemi.className} font-semibold text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2`}>
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="font-serif leading-relaxed text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className={`${nohemi.className} font-semibold text-gray-900 dark:text-gray-100`}>
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="font-serif text-gray-700 dark:text-gray-400">
                              {children}
                            </em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-3">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="font-serif text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300">
                              {children}
                            </li>
                          ),
                          code: ({ children }) => (
                            <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono">
                              {children}
                            </code>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0 bg-gradient-to-br from-gray-700 to-black dark:from-gray-800 dark:to-gray-900 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-2 sm:space-x-3 mb-4 sm:mb-6"
            >
              <div className="flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white dark:text-gray-900" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 dark:bg-gray-100 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-white dark:bg-gray-900 -mb-6 border-t border-gray-200 dark:border-gray-800 p-3 sm:p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2 sm:space-x-3">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about career paths, skills to learn"
                className={`min-h-[50px] sm:min-h-[60px] max-h-[100px] sm:max-h-[120px] text-xs sm:text-sm md:text-base resize-none border-2 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg sm:rounded-xl pr-12 placeholder:font-serif placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 dark:from-gray-100 dark:to-gray-200 dark:hover:from-gray-200 dark:hover:to-gray-300 text-white dark:text-gray-900 h-[50px] sm:h-[60px] px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg disabled:opacity-50"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 text-center font-serif italic">
            💡 Tip: Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
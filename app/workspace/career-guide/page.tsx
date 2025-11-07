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
    <div className={`flex flex-col h-[calc(100vh-140px)] ${nohemi.variable}`}>
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-3 mb-6 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 rounded-2xl shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white"
                      : "bg-white border border-indigo-100"
                  }`}
                >
                  <div
                    className={`prose prose-sm max-w-none ${
                      message.role === "user"
                        ? `text-white ${nohemi.className}`
                        : "text-gray-800"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className={`${nohemi.className} font-bold text-2xl text-indigo-900 mb-3`}>
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className={`${nohemi.className} font-semibold text-xl text-indigo-800 mb-2`}>
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className={`${nohemi.className} font-semibold text-lg text-indigo-700 mb-2`}>
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="font-serif leading-relaxed text-gray-700 mb-2">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className={`${nohemi.className} font-semibold text-indigo-900`}>
                              {children}
                            </strong>
                          ),
                          em: ({ children }) => (
                            <em className="font-serif text-indigo-600">
                              {children}
                            </em>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1 mb-3">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-1 mb-3">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="font-serif text-gray-700">
                              {children}
                            </li>
                          ),
                          code: ({ children }) => (
                            <code className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-mono">
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
                  <div className="flex-shrink-0 bg-gradient-to-br from-gray-700 to-black p-3 rounded-2xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3 mb-6"
            >
              <div className="flex-shrink-0 bg-gradient-to-br from-indigo-600 to-indigo-800 p-3 rounded-2xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 bg-white -mb-6 border-t border-indigo-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about career paths, skills to learn, or course recommendations..."
                className={`min-h-[60px] max-h-[120px] resize-none border-2 border-indigo-200 focus:border-indigo-500 rounded-xl pr-12 ${nohemi.className} placeholder:font-serif placeholder:italic`}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white h-[60px] px-6 rounded-xl shadow-lg disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center font-serif italic">
            💡 Tip: Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
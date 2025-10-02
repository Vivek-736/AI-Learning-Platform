// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "./globals.css";
import { Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#9333ea",
};

export const metadata: Metadata = {
  title: "EruditeAI - Your AI Learning Companion",
  description: "AI-powered learning platform for students and educators. Transform any content into personalized flashcards, intelligent notes, and interactive voice interviews.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EruditeAI",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "EruditeAI",
    "application-name": "EruditeAI",
    "msapplication-TileColor": "#9333ea",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
        variables: {
          colorPrimary: "#9333ea",
          colorText: "#2e1065",
          colorBackground: "#faf5ff",
          colorInputBackground: "#ffffff",
          colorInputText: "#2e1065",
        },
        elements: {
          card: "border-2 border-purple-500",
          headerTitle: "text-2xl font-semibold text-purple-700",
          headerSubtitle: "text-purple-600",
          socialButtonsBlockButton: "bg-purple-600 hover:bg-purple-700 text-white",
          formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-white",
          formFieldLabel: "text-purple-800",
          footer: "text-purple-600",
          footerActionLink: "text-purple-700 hover:text-purple-800",
          profileSectionTitle: "text-purple-700",
          formFieldInput: "border-purple-300 focus:border-purple-500 focus:ring-purple-500",
          badge: "bg-purple-100 text-purple-800",
          alert: "bg-purple-50 border-purple-200 text-purple-800",
          button: "mr-2",
          avatar: "border-2 border-purple-400",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${poppins.variable} antialiased`}
        >
          <Provider>
            {children}
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
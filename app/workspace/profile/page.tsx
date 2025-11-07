import React from "react";
import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <div className="flex items-center justify-center">
      <UserProfile
        appearance={{
          baseTheme: undefined,
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            colorTextSecondary: "#6b7280",
            colorInputBackground: "#f9fafb",
            colorInputText: "#111827",
            borderRadius: "0.75rem",
            spacingUnit: "1rem",
          },
          elements: {
            rootBox: "shadow-none border-0",
            card: "shadow-none border border-gray-200 rounded-xl",
            headerTitle: "text-gray-900 font-bold text-xl",
            headerSubtitle: "text-gray-600",
            socialButtonsBlockButton:
              "border-2 border-gray-200 hover:border-indigo-300 rounded-lg",
            formButtonPrimary:
              "bg-gradient-to-r from-indigo-500 to-indigo-500 hover:from-indigo-600 hover:to-indigo-600 rounded-lg font-medium transition-all duration-200 transform hover:scale-105",
            footerActionLink:
              "text-indigo-600 hover:text-indigo-700 font-medium",
            identityPreviewText: "text-gray-700 font-medium",
            identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700",
            profileSectionTitle: "text-gray-900 font-semibold",
            profileSectionContent: "bg-gray-50 rounded-lg p-4",
            badge: "bg-green-100 text-green-800 border border-green-200",
            menuButton:
              "hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg transition-colors",
            menuItem:
              "hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg",
            pageScrollBox: "custom-scrollbar",
          },
          layout: {
            logoImageUrl: undefined,
            showOptionalFields: true,
          },
        }}
        routing="hash"
      />
    </div>
  );
};

export default ProfilePage;

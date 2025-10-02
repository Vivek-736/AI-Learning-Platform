'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissed && !deferredPrompt) {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        const promptEvent = e as BeforeInstallPromptEvent;
        setDeferredPrompt(promptEvent);
        // Store globally for persistence
        (window as any).deferredPWAInstallPrompt = promptEvent;
        setShowInstallButton(true);
        console.log('PWA install prompt captured and ready');
      }
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      // Clear dismissal since app is now installed
      sessionStorage.removeItem('pwa-install-dismissed');
      console.log('PWA was installed');
    };

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    if (!isStandalone && !isInWebAppiOS) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    } else {
      setShowInstallButton(false);
    }

    if ((window as any).deferredPWAInstallPrompt && !deferredPrompt) {
      setDeferredPrompt((window as any).deferredPWAInstallPrompt);
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setShowInstallButton(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }
    
    try {
      console.log('Showing install prompt...');
      
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('Install prompt outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Clear the stored prompt
        (window as any).deferredPWAInstallPrompt = null;
        
        // After successful install, redirect to open the app
        setTimeout(() => {
          // This will open the installed PWA
          window.location.href = window.location.origin;
        }, 1000);
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    } finally {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    console.log('Install button dismissed');
    
    if (deferredPrompt) {
      setDeferredPrompt(null);
      (window as any).deferredPWAInstallPrompt = null;
    }
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setShowInstallButton(false);
    }
  }, []);

  if (!showInstallButton) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
              >
                Install EruditeAI App
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            onClick={handleInstallClick}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/25 border-2 border-white/20 transition-all duration-300"
          >
            <Download className="h-6 w-6 text-white" />
          </Button>

          <motion.button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center shadow-md transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-3 w-3" />
          </motion.button>

          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-400/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallButton;

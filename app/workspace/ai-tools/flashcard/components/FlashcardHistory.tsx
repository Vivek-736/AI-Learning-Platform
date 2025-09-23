'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';

interface FlashcardHistoryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FlashcardHistory: React.FC<FlashcardHistoryProps> = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Flashcard History</DialogTitle>
                    <DialogDescription>
                        Track your study sessions and progress
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No History yet, generate one!</h3>
                        <p className="text-gray-500">We&apos;re working on detailed study analytics and progress tracking.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FlashcardHistory;

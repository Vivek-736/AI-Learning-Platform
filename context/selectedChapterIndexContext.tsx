import { createContext } from "react";

export const SelectedChapterIndexContext = createContext<{
  selectedChapterIndex: number;
  setSelectedChapterIndex: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

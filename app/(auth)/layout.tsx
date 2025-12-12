import type { ReactNode } from "react";
import Image from "next/image";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen w-full bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
            <div className="flex min-h-screen flex-col lg:flex-row">
                <aside className="relative hidden w-full items-center justify-center overflow-hidden bg-slate-200 px-8 py-10 lg:flex lg:w-1/2 dark:bg-slate-950">
                    <div className="pointer-events-none absolute inset-0 opacity-80 blur-3xl">
                        <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-200/40 dark:bg-cyan-500/40" />
                        <div className="absolute bottom-10 right-0 h-52 w-52 rounded-full bg-violet-200/40 dark:bg-violet-500/40" />
                    </div>

                    <div className="relative z-10 flex w-full max-w-xl flex-col gap-8">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300/80">
                                Learn with AI
                            </p>
                            <h2 className="text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl dark:text-slate-50">
                                Turn any content into a personalized learning journey.
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300/90">
                                Generate courses, quizzes, flashcards and interview drills from chapters, PDFs or your own notes.
                            </p>
                        </div>

                        <div className="relative flex items-center justify-center">
                            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-200/80 ring-1 ring-slate-200/80 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/40 dark:ring-slate-800/80">
                                <Image
                                    src="/auth-ai-hero.svg"
                                    alt="AI-powered learning interface illustration"
                                    width={900}
                                    height={900}
                                    priority
                                    className="h-auto w-full rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex min-h-screen flex-1 flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
                    <section className="flex flex-1 items-center justify-center">
                        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl shadow-gray-200/60 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90 dark:shadow-black/40 sm:p-10">
                            <div className="mb-8 space-y-2 text-center">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                                    Welcome to Fascinity
                                </h1>
                            </div>
                            <div className="space-y-6">{children}</div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;

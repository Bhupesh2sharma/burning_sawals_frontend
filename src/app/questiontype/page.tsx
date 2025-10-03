"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiHome } from "react-icons/fi";
import { BiSolidComment } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import {
    getAllQuestionTypes,
    getQuestionsByGenre,
    AnalyticsService,
} from "../../utils/api";
import { useAuth } from "../../components/AuthProvider";
import RouteGuard from "../../components/RouteGuard";

export default function QuestionTypePage() {
    const { token, isAuthenticated } = useAuth();
    const [questionTypes, setQuestionTypes] = useState<any[]>([]);
    const [selectedQuestionType, setSelectedQuestionType] = useState<any>(null);
    const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [interactionLoading, setInteractionLoading] = useState(false);
    const [interactionFeedback, setInteractionFeedback] = useState<string>("");
    const [lastInteraction, setLastInteraction] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Fetch all question types
    useEffect(() => {
        const fetchQuestionTypes = async () => {
            try {
                setLoading(true);
                const response = await getAllQuestionTypes();
                const types = response.data || response;
                setQuestionTypes(Array.isArray(types) ? types : []);
            } catch (error) {
                // Handle error silently or show user-friendly message
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionTypes();
    }, []);

    // Fetch questions for selected genre
    useEffect(() => {
        if (!selectedGenreId) return;
        setLoading(true);
        getQuestionsByGenre(String(selectedGenreId))
            .then((data) => {
                const questionsData = data.data?.items || data.data || [];
                setQuestions(Array.isArray(questionsData) ? questionsData : []);
                setCurrentQuestionIdx(0);
            })
            .catch((error) => {
                setQuestions([]);
            })
            .finally(() => setLoading(false));
    }, [selectedGenreId]);

    // Handlers for next/prev question
    const handlePrev = () => {
        setCurrentQuestionIdx((idx) =>
            idx > 0 ? idx - 1 : questions.length - 1
        );
    };

    const handleNext = () => {
        setCurrentQuestionIdx((idx) =>
            idx < questions.length - 1 ? idx + 1 : 0
        );
    };

    // Get current question
    const currentQuestion = questions[currentQuestionIdx];

    // Handle user interactions
    const handleInteraction = async (
        interactionType: "like" | "dislike" | "super_like"
    ) => {
        if (!isAuthenticated || !token) {
            setInteractionFeedback("Please login to interact with questions");
            setTimeout(() => setInteractionFeedback(""), 3000);
            return;
        }

        if (!currentQuestion) return;

        try {
            setInteractionLoading(true);
            setIsAnimating(true);
            setLastInteraction(interactionType);

            await AnalyticsService.addQuestionInteraction(
                currentQuestion.question_id.toString(),
                interactionType,
                token
            );

            const feedbackMessages = {
                like: "👍 Liked!",
                dislike: "👎 Disliked!",
                super_like: "🔥 Super liked!",
            };

            setInteractionFeedback(feedbackMessages[interactionType]);

            // Reset animation state after animation completes
            setTimeout(() => {
                setIsAnimating(false);
                setLastInteraction(null);
            }, 800);

            setTimeout(() => setInteractionFeedback(""), 2000);
        } catch (error) {
            setInteractionFeedback("Failed to record interaction");
            setTimeout(() => setInteractionFeedback(""), 3000);
        } finally {
            setInteractionLoading(false);
        }
    };

    if (loading && questionTypes.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading question types...</p>
                </div>
            </div>
        );
    }

    return (
        <RouteGuard>
            <div className="flex flex-col bg-[#feedf2]">
                {/* Animation Styles */}
                <style jsx>{`
                    @keyframes bounce {
                        0%,
                        20%,
                        53%,
                        80%,
                        100% {
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                        40%,
                        43% {
                            transform: translate3d(0, -15px, 0) scale(1.2);
                        }
                        70% {
                            transform: translate3d(0, -7px, 0) scale(1.1);
                        }
                        90% {
                            transform: translate3d(0, -2px, 0) scale(1.05);
                        }
                    }

                    @keyframes shake {
                        0%,
                        100% {
                            transform: translateX(0);
                        }
                        10%,
                        30%,
                        50%,
                        70%,
                        90% {
                            transform: translateX(-5px);
                        }
                        20%,
                        40%,
                        60%,
                        80% {
                            transform: translateX(5px);
                        }
                    }

                    @keyframes fire {
                        0% {
                            transform: scale(1) rotate(0deg);
                        }
                        25% {
                            transform: scale(1.3) rotate(-5deg);
                        }
                        50% {
                            transform: scale(1.1) rotate(5deg);
                        }
                        75% {
                            transform: scale(1.2) rotate(-3deg);
                        }
                        100% {
                            transform: scale(1) rotate(0deg);
                        }
                    }

                    .animate-bounce {
                        animation: bounce 0.8s ease-in-out;
                    }

                    .animate-shake {
                        animation: shake 0.5s ease-in-out;
                    }

                    .animate-fire {
                        animation: fire 0.7s ease-in-out;
                    }

                    .like-active {
                        color: #3b82f6 !important;
                        transform: scale(1.2);
                    }

                    .dislike-active {
                        color: #ef4444 !important;
                        transform: scale(1.2);
                    }

                    .superlike-active {
                        color: #f97316 !important;
                        transform: scale(1.2);
                    }
                `}</style>
                {/* Header above card, aligned with card container */}
                <div
                    className="relative w-full max-w-md mx-auto mt-4 mb-2"
                    style={{ minHeight: 48 }}
                >
                    <button
                        type="button"
                        className="absolute left-2 top-1/2 -translate-y-1/2 group cursor-pointer"
                    >
                        <FiHome
                            size={24}
                            className="text-4xl text-gray-600 cursor-pointer"
                            strokeWidth={3}
                        />
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            Go to home
                        </span>
                    </button>
                    <h1 className="text-2xl font-libre-bodoni text-black text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 justify-center w-max">
                        {selectedQuestionType
                            ? selectedQuestionType.type_name
                            : "Question Types"}{" "}
                        <span>🧑‍🤝‍🧑</span>
                    </h1>
                    {/* Right side - Feedback & Suggestions text */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <span className="text-xs font-libre-bodoni text-gray-600">
                            feedback & suggestions
                        </span>
                    </div>
                </div>

                {/* Main Content Box */}
                <div className="flex flex-col items-center max-w-md mx-auto bg-[#E7E7E9] rounded-2xl p-4 mb-2">
                    {/* Question Type Selection */}
                    {!selectedQuestionType ? (
                        <div className="w-full">
                            <h2 className="text-lg font-semibold text-center mb-4">
                                Select a Question Type
                            </h2>
                            <div className="grid grid-cols-1 gap-2">
                                {questionTypes.map((questionType) => (
                                    <button
                                        key={questionType.type_id}
                                        onClick={() =>
                                            setSelectedQuestionType(
                                                questionType
                                            )
                                        }
                                        className="p-3 bg-white rounded-lg text-left hover:bg-gray-50 transition cursor-pointer"
                                    >
                                        <div className="font-medium text-gray-800">
                                            {questionType.type_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {questionType.genres?.length || 0}{" "}
                                            genres available
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Back to question types button */}
                            <button
                                onClick={() => {
                                    setSelectedQuestionType(null);
                                    setSelectedGenreId(null);
                                    setQuestions([]);
                                }}
                                className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm cursor-pointer"
                            >
                                ← Back to Question Types
                            </button>

                            {/* Genre Buttons */}
                            <div className="flex gap-2 justify-center mb-4 w-full max-w-xs flex-wrap">
                                {selectedQuestionType.genres?.map(
                                    (genre: any) => (
                                        <button
                                            key={genre.genre_id}
                                            className={`flex-1 bg-[#CB2655] text-white rounded-lg px-4 py-2 text-xs font-semibold shadow font-sans min-w-0 cursor-pointer ${
                                                selectedGenreId ===
                                                genre.genre_id
                                                    ? "ring-2 ring-pink-400"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedGenreId(
                                                    genre.genre_id
                                                )
                                            }
                                        >
                                            {genre.name
                                                .charAt(0)
                                                .toUpperCase() +
                                                genre.name.slice(1)}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Card */}
                            {selectedGenreId && (
                                <div
                                    className="relative rounded-md w-full max-w-xs mx-auto px-2 py-6 flex flex-col items-center min-h-[420px] h-[60vh] shadow-lg"
                                    style={{ backgroundColor: "#CB2655" }}
                                >
                                    {/* Top label and icon1.png */}
                                    <div className="ml-auto relative z-10">
                                        <Image
                                            src="/icon1.png"
                                            alt="icon1"
                                            width={42}
                                            height={42}
                                        />
                                    </div>
                                    <div className="flex w-full items-center mb-8 relative">
                                        <div className="flex-1 flex justify-center absolute left-0 right-0">
                                            <span className="text-white text-lg font-libre-bodoni text-center w-full">
                                                {loading
                                                    ? "Loading..."
                                                    : currentQuestion?.prompt ||
                                                      "No questions found for this genre."}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Question and arrows */}
                                    <div className="flex-1 flex items-center justify-center w-full relative">
                                        <span
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none"
                                            onClick={handlePrev}
                                        >
                                            &#60;
                                        </span>
                                        <span className="text-white text-center text-xl font-libre-bodoni px-2 mx-8 block w-full">
                                            {currentQuestion?.question || ""}
                                        </span>
                                        <span
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none"
                                            onClick={handleNext}
                                        >
                                            &#62;
                                        </span>
                                    </div>
                                    {/* Heart icon */}
                                    <div className="w-full flex justify-center mt-8">
                                        <Image
                                            src="/icon2.png"
                                            alt="love"
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                </div>
                            )}

                            {!selectedGenreId && (
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        Select a genre above to view questions.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Bottom Navigation Bar - only show when questions are loaded */}
                {questions.length > 0 && (
                    <nav className="flex justify-between items-center px-4 py-2 max-w-xs mx-auto w-full mb-2">
                        <button
                            type="button"
                            className="opacity-50 cursor-not-allowed"
                            title="Comment feature coming soon"
                        >
                            <BiSolidComment size={46} color="#D0BCFF" />
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleInteraction("like")}
                                disabled={
                                    interactionLoading || !currentQuestion
                                }
                                className={`transition-all duration-300 cursor-pointer ${
                                    interactionLoading
                                        ? "opacity-50"
                                        : "hover:opacity-80 hover:scale-110"
                                } ${
                                    lastInteraction === "like" && isAnimating
                                        ? "animate-bounce like-active"
                                        : ""
                                }`}
                                title="Like this question"
                            >
                                <AiOutlineLike size={40} />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleInteraction("super_like")}
                                disabled={
                                    interactionLoading || !currentQuestion
                                }
                                className={`transition-all duration-300 cursor-pointer ${
                                    interactionLoading
                                        ? "opacity-50"
                                        : "hover:opacity-80 hover:scale-110"
                                } ${
                                    lastInteraction === "super_like" &&
                                    isAnimating
                                        ? "animate-fire superlike-active"
                                        : ""
                                }`}
                                title="Super like this question"
                            >
                                <Image
                                    src="/icon4.png"
                                    alt="fire"
                                    width={40}
                                    height={40}
                                />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleInteraction("dislike")}
                            disabled={interactionLoading || !currentQuestion}
                            className={`transition-all duration-300 cursor-pointer ${
                                interactionLoading
                                    ? "opacity-50"
                                    : "hover:opacity-80 hover:scale-110"
                            } ${
                                lastInteraction === "dislike" && isAnimating
                                    ? "animate-shake dislike-active"
                                    : ""
                            }`}
                            title="Dislike this question"
                        >
                            <AiOutlineDislike size={40} />
                        </button>
                    </nav>
                )}

                {/* Interaction Feedback */}
                {interactionFeedback && (
                    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg z-50">
                        <p className="text-sm font-medium text-gray-800">
                            {interactionFeedback}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <footer className="py-2 text-center text-lg text-white font-libre-bodoni">
                    Burning Sawals 🔥
                </footer>
            </div>
        </RouteGuard>
    );
}

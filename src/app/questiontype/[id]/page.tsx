"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FiHome } from "react-icons/fi";
import { BiSolidComment } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import {
    getAllQuestionTypes,
    getQuestionsByGenre,
    AnalyticsService,
} from "../../../utils/api";
import { useAuth } from "../../../components/AuthProvider";
import RouteGuard from "../../../components/RouteGuard";

export default function QuestionTypePage() {
    const params = useParams();
    const router = useRouter();
    const questionTypeId = params.id as string;
    const { token, isAuthenticated, user } = useAuth();

    // Authentication state monitoring
    useEffect(() => {
        // Authentication state is being monitored
    }, [isAuthenticated, token, user]);

    const [questionType, setQuestionType] = useState<any>(null);
    const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [interactionLoading, setInteractionLoading] = useState(false);
    const [interactionFeedback, setInteractionFeedback] = useState<string>("");
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [isSwiping, setIsSwiping] = useState(false);
    const [lastInteraction, setLastInteraction] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Fetch question type and its genres
    useEffect(() => {
        const fetchQuestionType = async () => {
            try {
                setLoading(true);
                const response = await getAllQuestionTypes();
                console.log("All question types response:", response);

                const allQuestionTypes = response.data || [];
                const foundQuestionType = allQuestionTypes.find(
                    (qt: any) => qt.type_id === parseInt(questionTypeId)
                );

                if (foundQuestionType) {
                    setQuestionType(foundQuestionType);
                    console.log("Found question type:", foundQuestionType);
                    // Auto-select first genre if available
                    if (
                        foundQuestionType.genres &&
                        foundQuestionType.genres.length > 0
                    ) {
                        setSelectedGenreId(
                            foundQuestionType.genres[0].genre_id
                        );
                    }
                } else {
                    console.error(
                        "Question type not found for ID:",
                        questionTypeId
                    );
                }
            } catch (error) {
                console.error("Error fetching question type:", error);
            } finally {
                setLoading(false);
            }
        };

        if (questionTypeId) {
            fetchQuestionType();
        }
    }, [questionTypeId]);

    // Fetch questions for selected genre
    useEffect(() => {
        if (!selectedGenreId) return;
        setLoading(true);
        getQuestionsByGenre(String(selectedGenreId))
            .then((data) => {
                console.log("Questions data:", data);
                const questionsData = data.data?.items || data.data || [];
                setQuestions(Array.isArray(questionsData) ? questionsData : []);
                setCurrentQuestionIdx(0);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
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

    // Touch/Swipe handlers
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsSwiping(true);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext(); // Swipe left = next question
        }
        if (isRightSwipe) {
            handlePrev(); // Swipe right = previous question
        }

        setIsSwiping(false);
        setTouchStart(null);
        setTouchEnd(null);
    };

    // Get current question
    const currentQuestion = questions[currentQuestionIdx];

    // Handle user interactions
    const handleInteraction = async (
        interactionType: "like" | "dislike" | "super_like"
    ) => {
        console.log("Interaction attempt:", {
            isAuthenticated,
            token: token ? "present" : "missing",
            currentQuestion: currentQuestion?.question_id,
        });

        if (!isAuthenticated || !token) {
            setInteractionFeedback("Please login to interact with questions");
            setTimeout(() => setInteractionFeedback(""), 3000);
            return;
        }

        if (!currentQuestion) {
            setInteractionFeedback("No question selected");
            setTimeout(() => setInteractionFeedback(""), 2000);
            return;
        }

        try {
            setInteractionLoading(true);
            setIsAnimating(true);
            setLastInteraction(interactionType);

            console.log("Sending interaction:", {
                questionId: currentQuestion.question_id,
                interactionType,
                token: token.substring(0, 20) + "...",
            });

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
        } catch (error: any) {
            console.error("Error recording interaction:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);

            if (error.response?.status === 401) {
                setInteractionFeedback("Session expired. Please login again.");
            } else {
                setInteractionFeedback("Failed to record interaction");
            }
            setTimeout(() => setInteractionFeedback(""), 3000);
        } finally {
            setInteractionLoading(false);
        }
    };

    if (loading && !questionType) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#feedf2]">
                <div className="text-center">
                    {/* Shimmer Loading Effect */}
                    <div className="relative w-64 h-8 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                    <div className="relative w-48 h-6 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                    </div>
                    <p className="text-gray-600">Loading question type...</p>
                </div>
            </div>
        );
    }

    if (!questionType) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Question type not found</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-[#E63946] text-white rounded-md hover:bg-[#A0153A] transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <RouteGuard>
            <div className="flex flex-col bg-[#feedf2]">
                {/* All Animation Styles */}
                <style jsx>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .animate-shimmer {
                        animation: shimmer 1.5s infinite;
                    }
                    .genre-slider-container::-webkit-scrollbar {
                        display: none;
                    }

                    /* Interaction Animations */
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

                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                        }
                        70% {
                            transform: scale(1.1);
                            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
                        }
                        100% {
                            transform: scale(1);
                            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
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

                    @keyframes sparkle {
                        0% {
                            transform: scale(0) rotate(0deg);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1) rotate(180deg);
                            opacity: 0.8;
                        }
                        100% {
                            transform: scale(0) rotate(360deg);
                            opacity: 0;
                        }
                    }

                    .sparkle {
                        position: absolute;
                        width: 4px;
                        height: 4px;
                        background: #f97316;
                        border-radius: 50%;
                        animation: sparkle 0.6s ease-out;
                    }

                    .animate-bounce {
                        animation: bounce 0.8s ease-in-out;
                    }

                    .animate-pulse {
                        animation: pulse 0.6s ease-in-out;
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

                {/* Header with Home Icon and Question Type Title */}
                <div
                    className="relative w-full mx-auto mt-4 mb-2"
                    style={{ minHeight: 48 }}
                >
                    {/* Question Type Title - Centered */}
                    <h1 className="text-2xl font-libre-bodoni text-black text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 justify-center w-max">
                        {questionType.type_name} <span>😉</span>
                    </h1>
                </div>

                {/* Main Content Box (wraps category buttons and card) */}
                <div className="flex flex-col items-center w-[390px] mx-auto bg-[#E7E7E9] rounded-t-2xl p-4 mb-2">
                    {/* Category Buttons - Show max 3 with +X indicator */}
                    <div className="flex gap-2 justify-center mb-4 w-full">
                        {questionType.genres
                            ?.slice(0, 3)
                            .map((genre: any, index: number) => (
                                <button
                                    key={genre.genre_id}
                                    className={`w-[120px] bg-[#CB2655] text-white rounded-md px-4 py-2 text-xs font-semibold shadow font-sans transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                        selectedGenreId === genre.genre_id
                                            ? "ring-2 ring-pink-400"
                                            : "hover:bg-[#B01E4A]"
                                    }`}
                                    onClick={() =>
                                        setSelectedGenreId(genre.genre_id)
                                    }
                                >
                                    {genre.name.charAt(0).toUpperCase() +
                                        genre.name.slice(1)}
                                </button>
                            ))}
                        {questionType.genres &&
                            questionType.genres.length > 3 && (
                                <button
                                    className="w-[120px] bg-gray-400 text-white rounded-md px-4 py-2 text-sm font-semi-bold font-libre-bodoni shadow  cursor-pointer hover:bg-gray-500 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    onClick={() => {
                                        // Toggle showing all genres
                                        const slider = document.querySelector(
                                            ".genre-slider-container"
                                        ) as HTMLElement | null;
                                        if (slider) {
                                            slider.style.display =
                                                slider.style.display === "none"
                                                    ? "block"
                                                    : "none";
                                        }
                                    }}
                                >
                                    +{questionType.genres.length - 3}
                                </button>
                            )}
                    </div>

                    {/* Hidden slider container for all genres */}
                    <div
                        className="w-full overflow-x-auto mb-4 genre-slider-container hidden"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <div className="flex gap-2 min-w-max">
                            {questionType.genres?.map((genre: any) => (
                                <button
                                    key={genre.genre_id}
                                    className={`flex-shrink-0 w-[120px] bg-[#CB2655] text-white rounded-md px-4 py-2 text-xs font-semibold shadow font-sans ${
                                        selectedGenreId === genre.genre_id
                                            ? "ring-2 ring-pink-400"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedGenreId(genre.genre_id)
                                    }
                                >
                                    {genre.name.charAt(0).toUpperCase() +
                                        genre.name.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    ref={cardRef}
                    className={`relative rounded-md w-[390px] mx-auto px-4 py-8 flex flex-col items-center min-h-[350px] h-[45vh] shadow-lg transition-transform duration-300 ${
                        isSwiping ? "scale-95" : "scale-100"
                    }`}
                    style={{ backgroundColor: "#CB2655" }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Home Icon - Top Left of Card */}
                    <button
                        onClick={() => router.push("/home")}
                        className="absolute top-4 left-4 z-20 group"
                    >
                        <FiHome
                            size={20}
                            className="text-white cursor-pointer hover:text-gray-200 transition-all duration-300 hover:scale-110"
                            strokeWidth={3}
                        />
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                            Go to home
                        </span>
                    </button>

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
                            {loading ? (
                                <div className="relative w-full h-6 bg-white/20 rounded-lg overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                </div>
                            ) : (
                                <span className="text-white text-lg text-2xl font-semi-bold font-libre-bodoni text-2xl font-semi-bold text-center w-full">
                                    {currentQuestion?.prompt ||
                                        "No questions found for this genre."}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Question and arrows */}
                    <div className="flex-1 flex items-center justify-center w-full relative">
                        <span
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none hover:scale-110 transition-transform"
                            onClick={handlePrev}
                        >
                            &#60;
                        </span>
                        {loading ? (
                            <div className="relative w-full h-8 bg-white/20 rounded-lg overflow-hidden mx-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                            </div>
                        ) : (
                            <span className="text-white text-center text-xl font-libre-bodoni px-2 mx-8 block w-full">
                                {currentQuestion?.question || ""}
                            </span>
                        )}
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none hover:scale-110 transition-transform"
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

                {/* Bottom Navigation Bar - custom icons as buttons */}
                <nav className="flex justify-between items-center px-4 py-2 max-w-xs lg:max-w-lg mx-auto w-full mb-2">
                    <button
                        type="button"
                        className="opacity-50 cursor-not-allowed drop-shadow-lg"
                        title="Comment feature coming soon"
                    >
                        <BiSolidComment size={46} color="#D0BCFF" />
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleInteraction("like")}
                            disabled={interactionLoading || !currentQuestion}
                            className={`transition-all duration-300 drop-shadow-lg cursor-pointer ${
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
                            disabled={interactionLoading || !currentQuestion}
                            className={`relative transition-all duration-300 drop-shadow-lg cursor-pointer ${
                                interactionLoading
                                    ? "opacity-50"
                                    : "hover:opacity-80 hover:scale-110"
                            } ${
                                lastInteraction === "super_like" && isAnimating
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
                            {lastInteraction === "super_like" &&
                                isAnimating && (
                                    <>
                                        <div
                                            className="sparkle"
                                            style={{
                                                top: "10px",
                                                left: "10px",
                                                animationDelay: "0s",
                                            }}
                                        ></div>
                                        <div
                                            className="sparkle"
                                            style={{
                                                top: "20px",
                                                right: "10px",
                                                animationDelay: "0.1s",
                                            }}
                                        ></div>
                                        <div
                                            className="sparkle"
                                            style={{
                                                bottom: "10px",
                                                left: "15px",
                                                animationDelay: "0.2s",
                                            }}
                                        ></div>
                                        <div
                                            className="sparkle"
                                            style={{
                                                bottom: "15px",
                                                right: "15px",
                                                animationDelay: "0.3s",
                                            }}
                                        ></div>
                                    </>
                                )}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => handleInteraction("dislike")}
                        disabled={interactionLoading || !currentQuestion}
                        className={`transition-all duration-300 drop-shadow-lg cursor-pointer ${
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

                {/* Interaction Feedback */}
                {interactionFeedback && (
                    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg px-6 py-3 shadow-xl z-50 animate-bounce">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">
                                {interactionFeedback.includes("👍") && "👍"}
                                {interactionFeedback.includes("👎") && "👎"}
                                {interactionFeedback.includes("🔥") && "🔥"}
                            </span>
                            <p className="text-lg font-bold text-gray-800">
                                {interactionFeedback}
                            </p>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="py-2 text-center  text-2xl font-semi-bold text-black font-libre-bodoni">
                    Designed to deepen human connection
                </footer>
            </div>
        </RouteGuard>
    );
}

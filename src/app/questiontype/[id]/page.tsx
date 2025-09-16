"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FiHome } from "react-icons/fi";
import { BiSolidComment } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { getAllQuestionTypes, getQuestionsByGenre, AnalyticsService } from "../../../utils/api";
import { useAuth } from "../../../components/AuthProvider";

export default function QuestionTypePage() {
  const params = useParams();
  const questionTypeId = params.id as string;
  const { token, isAuthenticated, user, logout } = useAuth();

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
          if (foundQuestionType.genres && foundQuestionType.genres.length > 0) {
            setSelectedGenreId(foundQuestionType.genres[0].genre_id);
          }
        } else {
          console.error("Question type not found for ID:", questionTypeId);
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
    setCurrentQuestionIdx((idx) => (idx > 0 ? idx - 1 : questions.length - 1));
  };
  
  const handleNext = () => {
    setCurrentQuestionIdx((idx) => (idx < questions.length - 1 ? idx + 1 : 0));
  };

  // Get current question
  const currentQuestion = questions[currentQuestionIdx];

  // Handle user interactions
  const handleInteraction = async (interactionType: 'like' | 'dislike' | 'super_like') => {
    console.log("Interaction attempt:", { isAuthenticated, token: token ? "present" : "missing", currentQuestion: currentQuestion?.question_id });
    
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
      console.log("Sending interaction:", {
        questionId: currentQuestion.question_id,
        interactionType,
        token: token.substring(0, 20) + "..."
      });
      
      await AnalyticsService.addQuestionInteraction(
        currentQuestion.question_id.toString(),
        interactionType,
        token
      );
      
      const feedbackMessages = {
        like: "👍 Liked!",
        dislike: "👎 Disliked!",
        super_like: "🔥 Super liked!"
      };
      
      setInteractionFeedback(feedbackMessages[interactionType]);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
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
    <div className="flex flex-col bg-[#feedf2]">
      {/* Header with Home Icon and Question Type Title */}
      <div className="relative w-full max-w-md lg:max-w-2xl mx-auto mt-4 mb-2" style={{ minHeight: 48 }}>
        {/* Home Icon - Top Left */}
        {/* <button type="button" className="absolute left-2 top-1/2 -translate-y-1/2 group">
          <FiHome size={24} className="text-4xl text-gray-600 cursor-pointer" strokeWidth={3} />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Go to home</span>
        </button> */}
        {/* Question Type Title - Centered */}
        <h1 className="text-2xl font-libre-bodoni text-black text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 justify-center w-max">
          {questionType.type_name} <span>😉</span>
        </h1>
      </div>

      {/* Main Content Box (wraps category buttons and card) */}
      <div className="flex flex-col items-center max-w-md lg:max-w-2xl mx-auto bg-[#E7E7E9] rounded-2xl p-4 mb-2">

        {/* Category Buttons */}
        <div className="flex gap-2 justify-center mb-4 w-full max-w-xs lg:max-w-lg">
          {questionType.genres?.map((genre: any) => (
            <button
              key={genre.genre_id}
              className={`flex-1 bg-[#CB2655] text-white rounded-lg px-4 py-2 text-xs font-semibold shadow font-sans ${selectedGenreId === genre.genre_id ? 'ring-2 ring-pink-400' : ''}`}
              onClick={() => setSelectedGenreId(genre.genre_id)}
            >
              {genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}
            </button>
          ))}
        </div>
        {/* Card */}
        <div className="relative rounded-md w-full max-w-xs lg:max-w-5xl mx-auto px-4 py-8 flex flex-col items-center min-h-[350px] h-[45vh] shadow-lg" style={{ backgroundColor: '#CB2655' }}>
          {/* Top label and icon1.png */}
          <div className="ml-auto relative z-10">
            <Image src="/icon1.png" alt="icon1" width={42} height={42} />
          </div>
          <div className="flex w-full items-center mb-8 relative">
            <div className="flex-1 flex justify-center absolute left-0 right-0">
              <span className="text-white text-lg font-libre-bodoni text-center w-full">
                {loading ? 'Loading...' : currentQuestion?.prompt || 'No questions found for this genre.'}
              </span>
            </div>
          </div>
          {/* Question and arrows */}
          <div className="flex-1 flex items-center justify-center w-full relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none" onClick={handlePrev}>&#60;</span>
            <span className="text-white text-center text-xl font-libre-bodoni px-2 mx-8 block w-full">
              {currentQuestion?.question || ''}
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none" onClick={handleNext}>&#62;</span>
          </div>
          {/* Heart icon */}
          <div className="w-full flex justify-center mt-8">
            <Image src="/icon2.png" alt="love" width={40} height={40} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - custom icons as buttons */}
      <nav className="flex justify-between items-center px-4 py-2 max-w-xs lg:max-w-lg mx-auto w-full mb-2">
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
            onClick={() => handleInteraction('like')}
            disabled={interactionLoading || !currentQuestion}
            className={`transition-opacity ${interactionLoading ? 'opacity-50' : 'hover:opacity-80'}`}
            title="Like this question"
          >
            <AiOutlineLike size={40} />
          </button>
          <button 
            type="button"
            onClick={() => handleInteraction('super_like')}
            disabled={interactionLoading || !currentQuestion}
            className={`transition-opacity ${interactionLoading ? 'opacity-50' : 'hover:opacity-80'}`}
            title="Super like this question"
          >
            <Image src="/icon4.png" alt="fire" width={40} height={40} />
          </button>
        </div>
        <button 
          type="button"
          onClick={() => handleInteraction('dislike')}
          disabled={interactionLoading || !currentQuestion}
          className={`transition-opacity ${interactionLoading ? 'opacity-50' : 'hover:opacity-80'}`}
          title="Dislike this question"
        >
          <AiOutlineDislike size={40} />
        </button>
      </nav>

      {/* Interaction Feedback */}
      {interactionFeedback && (
        <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg z-50">
          <p className="text-sm font-medium text-gray-800">{interactionFeedback}</p>
        </div>
      )}


      {/* Footer */}
      <footer className="py-2 text-center  text-lg text-black font-serif">
        Designed to deepen human connection
      </footer>
    </div>
  );
}

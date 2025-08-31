"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiHome } from "react-icons/fi";
import { BiSolidComment } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { getAllQuestionTypes, getQuestionsByGenre } from "../../utils/api";

export default function DatesPage() {
  const [dateGenres, setDateGenres] = useState<any[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Fetch genres for 'For Date' question type
  useEffect(() => {
    const fetchDateGenres = async () => {
      const allTypes = await getAllQuestionTypes();
      const types = allTypes.data || allTypes;
      const dateType = types.find((t: any) =>
        t.type_name.toLowerCase().includes("date")
      );
      if (dateType && Array.isArray(dateType.genres)) {
        setDateGenres(dateType.genres);
        // Optionally select the first genre by default
        if (dateType.genres.length > 0) {
          setSelectedGenreId(dateType.genres[0].genre_id);
        }
      }
    };
    fetchDateGenres();
  }, []);

  // Fetch questions for selected genre
  useEffect(() => {
    if (!selectedGenreId) return;
    setLoading(true);
    getQuestionsByGenre(String(selectedGenreId))
      .then((data) => {
        setQuestions(Array.isArray(data.data) ? data.data : []);
        setCurrentQuestionIdx(0);
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

  return (
    <div className="flex flex-col bg-[#feedf2]">
      {/* Header above card, aligned with card container */}
      <div className="relative w-full max-w-md mx-auto mt-4 mb-2" style={{ minHeight: 48 }}>
        <button type="button" className="absolute left-2 top-1/2 -translate-y-1/2 group">
          <FiHome size={24} className="text-4xl text-gray-600 cursor-pointer" strokeWidth={3} />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">Go to home</span>
        </button>
        <h1 className="text-2xl font-libre-bodoni text-black text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 justify-center w-max">
          Dates <span>😉</span>
        </h1>
      </div>

      {/* Main Content Box (wraps category buttons and card) */}
      <div className="flex flex-col items-center max-w-md mx-auto bg-[#E7E7E9] rounded-2xl p-4 mb-2">
        {/* Category Buttons */}
        <div className="flex gap-2 justify-center mb-4 w-full max-w-xs">
          {dateGenres.map((genre) => (
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
        <div className="relative rounded-md w-full max-w-xs mx-auto px-2 py-6 flex flex-col items-center min-h-[420px] h-[60vh] shadow-lg" style={{ backgroundColor: '#CB2655' }}>
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
      <nav className="flex justify-between items-center px-4 py-2 max-w-xs mx-auto w-full mb-2">
        <button type="button">
          <BiSolidComment size={46} color="#D0BCFF" />
        </button>
        <div className="flex gap-2">
          <button type="button">
            <AiOutlineLike size={40} />
          </button>
          <Image src="/icon4.png" alt="fire" width={40} height={40} />
        </div>
        <button type="button">
          <AiOutlineDislike size={40} />
        </button>
      </nav>

      {/* Footer */}
      <footer className="py-2 text-center  text-lg text-black font-serif">
        Designed to deepen human connection
      </footer>
    </div>
  );
}

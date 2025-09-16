"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllQuestionTypes } from "../../utils/api";

interface QuestionType {
  type_id: number;
  type_name: string;
  created_at: string;
  updated_at: string;
  genres: Array<{
    genre_id: number;
    name: string;
  }>;
}

// Default images for question types
const getDefaultImage = (typeName: string) => {
  const imageMap: { [key: string]: string } = {
    "For Date": "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0",
    "For Friends": "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0",
    "Community": "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "Multiple Choice": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "Math": "https://images.unsplash.com/photo-1635070041078-e43d6d8aef2e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "who am i": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
  };
  
  return imageMap[typeName] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0";
};

export default function HomePage() {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        setLoading(true);
        const response = await getAllQuestionTypes();
        console.log("Question types response:", response);
        setQuestionTypes(response.data || []);
      } catch (err: any) {
        console.error("Error fetching question types:", err);
        setError("Failed to load question types");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionTypes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-pink-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-pink-50 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#E63946] text-white rounded-md hover:bg-[#A0153A] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <div className="w-full h-20 flex items-center justify-center py-6">
        <Link
          href="#"
          className="text-[#E63946] text-3xl underline underline-offset-4 font-bold"
        >
          Talk
        </Link>
      </div>

      {/* Cards */}
      <div className="w-full flex flex-col gap-0 my-4">
        {questionTypes.map((questionType) => (
          <Link href={`/questiontype/${questionType.type_id}`} key={questionType.type_id}>
            <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 bg-black overflow-hidden rounded-none shadow-none">
              <Image
                src={getDefaultImage(questionType.type_name)}
                alt={questionType.type_name}
                fill
                className="object-cover bg-black"
              />
              <div className="absolute inset-0 bg-[#E63946]/70 flex items-center justify-center">
                <span className="text-white text-xl font-bold tracking-wide">
                  {questionType.type_name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Footer */}
      <footer className="py-2 text-center text-lg text-black font-serif">
        Designed to deepen human connection
      </footer>
    </div>
  );
}

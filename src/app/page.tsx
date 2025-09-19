// src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllQuestionTypes } from "../utils/api";
import { useAuth } from "../components/AuthProvider";

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

// Array of unique images for each question type item
const getUniqueImage = (index: number) => {
  const images = [
    // Romantic/Dating
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Friends/Social
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Community/Group
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Educational/Academic
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Math/Science
    "https://images.unsplash.com/photo-1635070041078-e43d6d8aef2e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Personal/Identity
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Fun/Entertainment
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Family
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Professional/Business
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1526&auto=format&fit=crop&ixlib=rb-4.1.0",
    // Additional unique images
    "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
  ];
  // Use modulo to cycle through images if there are more question types than images
  return images[index % images.length];
};

// Function to get display text for each category
const getDisplayText = (typeName: string) => {
  if (typeName === "For Date") {
    return "For First dates";
  } else if (typeName === "For Friends") {
    return "For Friends";
  } else if (typeName === "Community") {
    return "Community";
  }
  return typeName;
};

export default function LandingPage() {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to home page
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, router]);

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

    // Only fetch data if user is not authenticated
    if (!isAuthenticated && !isLoading) {
      fetchQuestionTypes();
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  // Don't render landing page content if user is authenticated (they'll be redirected)
  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center font-sans pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E63946] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question types...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-center font-sans pt-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#E63946] text-white rounded-md hover:bg-[#A0153A] transition"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-start font-sans pt-20">
      {/* Top section */}
      <div className="flex flex-col items-center text-center p-6">
        <h2 className="text-xl text-[#000000] mb-4 font-libre-bodoni">Time to play the game</h2>
        <h2 className="text-xl text-[#000000] mb-4 font-libre-bodoni">Get sloshed</h2>
        <h2 className="text-xl text-[#000000] mb-4 font-libre-bodoni">Understand each other better</h2>
        <div className="relative flex justify-center items-center mt-2 mb-6">
          {/* Button */}
          <Link href="/login">
            <button className="bg-[#E63946] text-white px-10 py-3 rounded-full font-bold text-lg shadow-md">
              Start Playing
            </button>
          </Link>
          {/* Wire image positioned to the right of button, touching the button */}
          <Image
            src="/wire.png"
            alt="wire"
            className="absolute left-full top-1/2 -translate-y-1/2 -ml-2"
            width={600}
            height={100}
          />
        </div>
      </div>
      {/* Cards */}
      <div className="w-full flex flex-col gap-0 my-4">
        {questionTypes.map((questionType, index) => (
          <Link href={`/questiontype/${questionType.type_id}`} key={questionType.type_id}>
            <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 bg-black overflow-hidden rounded-none shadow-none">
              <Image
                src={getUniqueImage(index)}
                alt={questionType.type_name}
                fill
                className="object-cover bg-black"
              />
              <div className="absolute inset-0 bg-[#E63946]/70 flex items-center justify-center">
                <span className="text-white text-xl font-bold tracking-wide">
                  {getDisplayText(questionType.type_name)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Bottom link */}
      <div className="w-full h-20 bg-[#ffffff] flex items-center justify-center py-6">
        <Link
          href="#"
          className="text-[#E63946] text-3xl underline underline-offset-4 font-bold"
        >
          Talk
        </Link>
      </div>
    </main>
  );
}
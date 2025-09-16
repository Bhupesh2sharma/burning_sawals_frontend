"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllQuestionTypes } from "../../utils/api";

export default function HomePage() {
  const [questionTypes, setQuestionTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const response = await getAllQuestionTypes();
        const types = response.data || response;
        setQuestionTypes(Array.isArray(types) ? types : []);
      } catch (error) {
        console.error("Error fetching question types:", error);
        setQuestionTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestionTypes();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
   
   <div className="w-full h-20  flex items-center justify-center py-6">
        <Link
          href="#"
          className="text-[#E63946] text-3xl underline underline-offset-4 font-bold"
        >
          Talk
        </Link>
      </div>

      {/* Cards */}
      <div className="w-full flex flex-col gap-0 my-4">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-lg text-gray-600">Loading question types...</div>
          </div>
        ) : questionTypes.length > 0 ? (
          questionTypes.map((questionType, index) => {
            // Generate a dynamic image based on question type
            const getImageForType = (typeName: string) => {
              const type = typeName.toLowerCase();
              if (type.includes('date')) {
                return "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0";
              } else if (type.includes('friend')) {
                return "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0";
              } else if (type.includes('community')) {
                return "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0";
              } else {
                // Default image for other types
                return "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80";
              }
            };

            return (
              <Link href={`/genre/${questionType.type_id}`} key={questionType.type_id}>
                <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 bg-black overflow-hidden rounded-none shadow-none">
                  <Image
                    src={getImageForType(questionType.type_name)}
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
            );
          })
        ) : (
          <div className="flex items-center justify-center h-40">
            <div className="text-lg text-gray-600">No question types available</div>
          </div>
        )}
      </div>
      {/* Footer */}
      <footer className="py-2 text-center  text-lg text-black font-serif">
        Designed to deepen human connection
      </footer>
    </div>
  );
}

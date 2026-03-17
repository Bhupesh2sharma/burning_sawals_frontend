"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { blogCards } from "./data";

export default function BlogsPage() {
    return (
        <main className="min-h-screen bg-pink-100 flex items-center justify-center py-12">
            <div className="w-full max-w-6xl px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-[#BE1847] text-center mb-10">
                    Blogs
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col"
                        >
                            <div className="relative h-40 w-full">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="inline-flex items-center rounded-full bg-[#FDE4EC] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#BE1847]">
                                        {card.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col p-5 gap-3">
                                <div className="flex items-center text-xs text-gray-500 gap-2">
                                    <span>{card.readTime}</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                                    <span>{card.date}</span>
                                </div>

                                <h2 className="text-lg font-semibold text-slate-900 leading-snug">
                                    {card.title}
                                </h2>

                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {card.excerpt}
                                </p>

                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <div className="h-7 w-7 rounded-full bg-pink-100 flex items-center justify-center text-[10px] font-semibold text-[#BE1847]">
                                            {card.author
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <span>{card.author}</span>
                                    </div>

                                    <Link
                                        href={`/blogs/${card.slug}`}
                                        className="text-[#BE1847] font-semibold hover:underline cursor-pointer"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}


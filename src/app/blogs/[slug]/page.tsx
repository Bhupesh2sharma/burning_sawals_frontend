import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogCards } from "../data";

interface BlogPageProps {
    params: {
        slug: string;
    };
}

export default function BlogDetailPage({ params }: BlogPageProps) {
    const post = blogCards.find((b) => b.slug === params.slug);

    if (!post) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-pink-100/80 py-10">
            <div className="max-w-3xl mx-auto px-4 md:px-0 bg-white rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.08)] overflow-hidden">
                {/* Top image */}
                <div className="relative h-72 w-full">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <article className="px-6 md:px-10 py-8 md:py-10">
                    {/* Category + meta */}
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-gray-500 mb-4">
                        <span className="inline-flex items-center rounded-full bg-[#FDE4EC] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#BE1847]">
                            {post.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>{post.readTime}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-400" />
                        <span>{post.date}</span>
                    </div>

                    {/* Title + subtitle */}
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-2">
                        {post.title}
                    </h1>
                    <p className="text-base md:text-lg text-gray-700 mb-6">
                        {post.subtitle}
                    </p>

                    {/* Author row */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center text-xs font-semibold text-[#BE1847]">
                                {post.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">
                                    {post.author}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Writer at BurningSawals
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/blogs"
                            className="text-xs md:text-sm text-[#BE1847] font-semibold hover:underline cursor-pointer"
                        >
                            ← Back to all blogs
                        </Link>
                    </div>

                    {/* Content paragraphs – placeholder copy, layout-focused */}
                    <div className="space-y-5 text-[15px] leading-relaxed text-gray-800">
                        <p>
                            Every time someone sits down to write about{" "}
                            <span className="font-semibold lowercase">
                                {post.category}
                            </span>
                            , they secretly hope they are not the only one
                            feeling this strangely specific kind of ache. We
                            write to name the tension between who we are and who
                            we&apos;re trying to become, and somewhere in that
                            gap we find the people who understand us.
                        </p>
                        <p>
                            In a culture that moves fast and rewards loudness,
                            depth is often treated like an optional extra. This
                            piece is an invitation to do the opposite: to slow
                            down, to look closely at the quiet signals in your
                            relationships, routines, and internal monologue, and
                            to ask what they are really trying to tell you.
                        </p>
                        <p>
                            You don&apos;t need a grand life event to begin.
                            Most of the transformation we remember later starts
                            with something very small — a question you can no
                            longer ignore, a conversation you keep replaying, a
                            moment of discomfort that refuses to disappear.
                            When you stay with that moment long enough, it
                            becomes a doorway.
                        </p>
                        <p>
                            As you read, notice which ideas land a little too
                            close to home. Those are the sentences worth saving,
                            the ones to bring into your next walk, journal
                            entry, or late-night conversation. That&apos;s where
                            the real work — and the real connection — begins.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-[#BE1847] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#A0153A] transition cursor-pointer"
                        >
                            <span>♥</span>
                            <span>Like</span>
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-[#BE1847]/30 px-5 py-2 text-sm font-semibold text-[#BE1847] hover:bg-pink-50 transition cursor-pointer"
                        >
                            <span>⇪</span>
                            <span>Share</span>
                        </button>
                    </div>
                </article>
            </div>
        </main>
    );
}


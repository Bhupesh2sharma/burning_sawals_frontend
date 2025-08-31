// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-start font-sans">
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
        {[
          {
            title: "For First Dates",
            src: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0",
          },
          {
            title: "For Friends",
            src: "https://images.unsplash.com/photo-1621112904887-419379ce6824?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0",
          },
          {
            title: "Community",
            src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0",
          },
        ].map((card, index) => (
          <Link href="/login" key={index}>
            <div className="relative w-full h-40 sm:h-56 md:h-64 lg:h-72 bg-black overflow-hidden rounded-none shadow-none">
              <Image
                src={card.src}
                alt={card.title}
                fill
                className="object-cover bg-black"
              />
              <div className="absolute inset-0 bg-[#E63946]/70 flex items-center justify-center">
                <span className="text-white text-xl font-bold tracking-wide">
                  {card.title}
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

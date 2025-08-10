// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-start">
      {/* Top section */}
      <div className="flex flex-col items-center text-center p-6 font-libre-bodoni">
        <h2 className="text-xl text-[#000000] mb-4">Time to play the game</h2>
        <h2 className="text-xl text-[#000000] mb-4">Get sloshed</h2>
        <h2 className="text-xl text-[#000000] mb-4">Understand each other better</h2>
        
        <div className="relative flex justify-center items-center">
  {/* Button */}
  <button className="bg-[#B21F4B] text-white px-10 py-3 rounded-full font-serif text-lg">
    Start Playing
  </button>

  {/* Wire image positioned to the right of button */}
  <Image
    src="/wire.png"
    alt="wire"
    className="absolute left-full top-1/2 -translate-y-1/2"
    width={600} 
    height={100}
  />
</div>



      </div>

     {/* Cards */}
 {/* Cards */}
{/* Cards */}
<div className="w-full flex flex-col gap-3">
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
    <Link href="#" key={index}>
      <div className="relative w-full h-82 bg-black  overflow-hidden">
        <Image
          src={card.src}
          alt={card.title}
          fill
          className="object-contain bg-black"
        />
        <div className="absolute inset-0 bg-[#B21F4B]/70 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">
            {card.title}
          </span>
        </div>
      </div>
    </Link>
  ))}
</div>



      {/* Bottom link */}
      <div className="w-full h-82  bg-[#ffffff] flex items-center justify-center py-6">
  <Link
    href="#"
    className="text-[#B21F4B]  text-3xl underline underline-offset-4"
  >
    Talk
  </Link>
</div>

    </main>
  );
}

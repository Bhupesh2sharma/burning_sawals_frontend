import React from "react";

const sections = [
  {
    label: "For First dates",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "For Friends",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Community",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-pink-100">
      <header className="py-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-rose-700 underline decoration-2 decoration-rose-700 mb-2">Talk</h1>
      </header>
      <main className="flex-1 flex flex-col gap-4 px-2 max-w-md w-full mx-auto">
        {sections.map((section, idx) => (
          <div
            key={section.label}
            className="relative rounded-lg overflow-hidden h-36 md:h-48 flex items-center justify-center"
            style={{ minHeight: "120px" }}
          >
            <img
              src={section.img}
              alt={section.label}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <span className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg text-center">
                {section.label}
              </span>
            </div>
          </div>
        ))}
      </main>
      <footer className="py-2 text-center text-xs text-black font-serif border-t border-gray-300 bg-pink-100">
        Designed to deepen human connection
      </footer>
    </div>
  );
}

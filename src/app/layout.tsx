import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tilt_Warp, Rubik, Playfair_Display, GFS_Didot, Libre_Bodoni, Italiana } from "next/font/google";
import AuthProvider from "../components/AuthProvider";

// Fonts
const tiltWarp = Tilt_Warp({ subsets: ["latin"], weight: "400", variable: "--font-tilt" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const didot = GFS_Didot({ subsets: ["latin"], weight: "400", variable: "--font-didot" });
const bodoni = Libre_Bodoni({ subsets: ["latin"], variable: "--font-bodoni" });
const italiana = Italiana({ subsets: ["latin"], weight: "400", variable: "--font-italiana" });

export const metadata = {
  title: "Burning Sawals",
  description: "The Burning Questions platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <html lang="en" className={`${tiltWarp.variable} ${rubik.variable} ${playfair.variable} ${didot.variable} ${bodoni.variable} ${italiana.variable}`}>
        <body className="bg-[#feedf2] text-text font-rubik">
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}

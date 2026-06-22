import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import image_Half_Logo from "@/imports/Half_Logo.png";
import { Footer } from "./Footer";

// Shared style helpers for policy / guide pages
export const h1 = "text-4xl lg:text-5xl font-bold text-[#8A2BE2] mb-6";
export const h2 = "text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-24";
export const h3 = "text-lg font-semibold text-gray-900 mt-8 mb-2";
export const p = "text-gray-700 leading-relaxed mb-4";
export const ul = "list-disc pl-6 space-y-1.5 text-gray-700 mb-4 marker:text-[#8A2BE2]";
export const ulSub = "list-[circle] pl-6 space-y-1 text-gray-700 mt-1 marker:text-gray-400";

export function PolicyLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-['Satoshi',sans-serif] bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src={image_Half_Logo}
                alt="ToGatherSG Logo"
                className="h-12 w-12 rounded-lg object-cover mx-[-18px]"
              />
              <span className="font-semibold text-gray-900 text-[18px]">ToGatherSG</span>
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#8A2BE2] hover:text-[#8A2BE2]/80 font-medium transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to home
            </a>
          </div>
        </div>
      </header>

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {children}

          <div className="mt-14 pt-8 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#8A2BE2] hover:text-[#8A2BE2]/80 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to home
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

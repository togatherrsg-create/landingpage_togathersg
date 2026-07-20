import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import image_Half_Logo from "@/imports/Half_Logo.png";
import { Footer } from "./Footer";
import { CUSTOMER_TERMS } from "../customerTerms";

// Shared style helpers (match TermsPage)
const h2 = "text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-24";
const p = "text-gray-700 leading-relaxed mb-4";

// The customer T&Cs are authored in the app (src/content/legal.ts) as markdown:
// a title line, "## " section headings, and blank-line-separated paragraphs.
// Render that faithfully so the web page always matches the in-app terms.
function renderTerms(md: string) {
  const lines = md.split("\n");
  const out: JSX.Element[] = [];
  let para: string[] = [];
  let key = 0;
  const flush = () => {
    if (para.length) {
      out.push(
        <p key={key++} className={p}>
          {para.join(" ")}
        </p>,
      );
      para = [];
    }
  };
  // Drop the first line (the doc title) — it becomes the <h1> below.
  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith("## ")) {
      flush();
      out.push(
        <h2 key={key++} className={h2}>
          {line.slice(3)}
        </h2>,
      );
    } else {
      para.push(line);
    }
  }
  flush();
  return out;
}

export function CustomerTermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-['Satoshi',sans-serif] bg-white">
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
          <h1 className="text-4xl lg:text-5xl font-bold text-[#8A2BE2] mb-6">
            Terms &amp; Conditions of Use
          </h1>
          {renderTerms(CUSTOMER_TERMS)}
        </div>
      </main>

      <Footer />
    </div>
  );
}

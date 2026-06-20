import image_image__22_ from '@/imports/image__22_.jpg'
import { Button } from "./ui/button";
import { siteContent } from "../content";

export function HomeSection() {
  const { title, subtitle, heroImage, buttons } = siteContent.home;

  const handleButtonClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.open(href, "_blank");
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-bold leading-tight text-[#8a2be2] text-[48px]">
                {title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {buttons.map((button) => (
                <Button
                  key={button.label}
                  onClick={() => handleButtonClick(button.href)}
                  className={
                    button.type === "primary"
                      ? "bg-[#F4C300] hover:bg-[#F4C300]/90 text-gray-900 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                      : "bg-[#8A2BE2] hover:bg-[#8A2BE2]/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                  }
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={image_image__22_}
                alt="Community Learning Together"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F4C300] rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#8A2BE2] rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

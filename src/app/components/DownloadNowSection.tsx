import image_ToGatherSG_avail_on_ios__1_ from '@/imports/Live_on_app_store.png'
import image_Countdown_to_ios_launch from '@/imports/Countdown_to_ios_launch.jpg'
import { Button } from "./ui/button";
import { siteContent } from "../content";

export function DownloadNowSection() {
  const { title, subtitle, appScreenshot, description, buttons } = siteContent.downloadNow;

  const handleButtonClick = (href: string, type: string) => {
    if (type === "disabled") return;

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
    <section id="download-now" className="py-24 bg-gradient-to-br from-[#F4C300]/10 to-[#8A2BE2]/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  {title}
                </h2>
                <p className="text-xl text-gray-600">
                  {subtitle}
                </p>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {buttons.map((button) => (
                  <Button
                    key={button.label}
                    onClick={() => handleButtonClick(button.href, button.type)}
                    disabled={button.type === "disabled"}
                    className={
                      button.type === "primary"
                        ? "bg-[#8A2BE2] hover:bg-[#8A2BE2]/90 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-[15px]"
                        : "bg-gray-300 text-gray-500 font-semibold px-8 py-6 rounded-xl cursor-not-allowed text-[15px]"
                    }
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right - App Screenshot */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src={image_ToGatherSG_avail_on_ios__1_}
                  alt="ToGatherSG App Screenshot"
                  className="w-full max-w-xs h-auto rounded-lg mx-[10px] my-[0px]"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F4C300] rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

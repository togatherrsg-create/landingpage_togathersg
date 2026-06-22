import { Compass, Wallet, TrendingUp, LifeBuoy } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { siteContent } from "../content";

// Icon shown on each benefit card, in the same order as `benefits` in content.ts:
// Get Discovered, Earn Easily, Track Your Growth, ToGatherSG Support.
const benefitIcons = [Compass, Wallet, TrendingUp, LifeBuoy];

export function HostWithUsSection() {
  const { title, subtitle, benefits, ctaButton } = siteContent.hostWithUs;

  const handleCTAClick = () => {
    const href = ctaButton.href;
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (/^https?:\/\//.test(href)) {
      window.open(href, "_blank");
    } else {
      // Internal route, e.g. /host-guidelines
      window.location.href = href;
    }
  };

 return (
  <section id="host-with-us" className="py-24 bg-white">
    <div className="container mx-auto px-4">

      {/* Header (UNCHANGED - stays centered) */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
        <h2 className="font-bold text-gray-900 text-[36px]">
          {title}
        </h2>
        <p className="text-gray-600 text-[24px]">
          {subtitle}
        </p>
      </div>

      {/* Benefits Grid (UPDATED to 2 per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefitIcons[index % benefitIcons.length];
          return (
          <Card
            key={index}
            className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#F4C300] rounded-2xl"
          >
            <div className="space-y-1">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#F4C300] to-[#8A2BE2] p-0.5">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                  <Icon className="w-8 h-8 text-[#8A2BE2]" strokeWidth={2.2} />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          </Card>
          );
        })}
      </div>


        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={handleCTAClick}
            className="bg-[#8A2BE2] hover:bg-[#8A2BE2]/90 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {ctaButton.label}
          </Button>
        </div>
      </div>
    </section>
  );
}

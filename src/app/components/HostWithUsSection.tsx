import image_vxBcf from '@/imports/vxBcf.jpg'
import image_a2DUq from '@/imports/a2DUq.jpg'
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { siteContent } from "../content";

export function HostWithUsSection() {
  const { title, subtitle, benefits, ctaButton } = siteContent.hostWithUs;

  const handleCTAClick = () => {
    // For footer links, we'll scroll to footer or open external link
    if (ctaButton.href.startsWith("#")) {
      const element = document.querySelector(ctaButton.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.open(ctaButton.href, "_blank");
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
        {benefits.map((benefit, index) => (
          <Card
            key={index}
            className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#F4C300] rounded-2xl"
          >
            <div className="space-y-1">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[#F4C300] to-[#8A2BE2] p-0.5">
                <div className="w-full h-full rounded-xl overflow-hidden bg-white">
                  <img
                    src={image_vxBcf}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
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
        ))}
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

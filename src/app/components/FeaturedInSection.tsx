import image_ZaoBao_Without_face from '@/imports/ZaoBao_Without_face.png'
import { siteContent } from "../content";

export function FeaturedInSection() {
  const { title, subtitle, articleImage } = siteContent.featuredIn;

  return (
    <section id="featured-in" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-[36px]">
              {title}
            </h2>
            <p className="text-xl text-gray-600">
              {subtitle}
            </p>
          </div>

          {/* Article Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-4">
            <img
              src={image_ZaoBao_Without_face}
              alt="Press Coverage"
              className="w-55 h-auto rounded-lg mx-[320px] my-[10px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

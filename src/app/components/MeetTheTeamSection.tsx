import { Card } from "./ui/card";
import { siteContent } from "../content";

export function MeetTheTeamSection() {
  const { title, subtitle, team } = siteContent.meetTheTeam;

  return (
    <section id="meet-the-team" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="font-bold text-gray-900 text-[40px]">
            {title}
          </h2>
          <p className="text-gray-600 text-[18px]">
            {subtitle}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 rounded-2xl border-2 border-transparent hover:border-[#8A2BE2]"
            >
              {/* Photo */}
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#F4C300] to-[#8A2BE2]">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="p-6 space-y-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-[#8A2BE2] font-semibold">
                    {member.role}
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

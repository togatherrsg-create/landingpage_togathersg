import { Header } from "./components/Header";
import { HomeSection } from "./components/HomeSection";
import { FeaturedInSection } from "./components/FeaturedInSection";
import { HostWithUsSection } from "./components/HostWithUsSection";
import { MeetTheTeamSection } from "./components/MeetTheTeamSection";
import { ContactSection } from "./components/ContactSection";
import { DownloadNowSection } from "./components/DownloadNowSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen font-['Satoshi',sans-serif]">
      <Header />
      <main>
        <HomeSection />
        <FeaturedInSection />
        <HostWithUsSection />
        <MeetTheTeamSection />
        <ContactSection />
        <DownloadNowSection />
      </main>
      <Footer />
    </div>
  );
}

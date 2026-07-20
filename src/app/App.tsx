import { Header } from "./components/Header";
import { HomeSection } from "./components/HomeSection";
import { FeaturedInSection } from "./components/FeaturedInSection";
import { HostWithUsSection } from "./components/HostWithUsSection";
import { MeetTheTeamSection } from "./components/MeetTheTeamSection";
import { ContactSection } from "./components/ContactSection";
import { DownloadNowSection } from "./components/DownloadNowSection";
import { Footer } from "./components/Footer";
import { HostOnboardingPage } from "./components/HostOnboardingPage";
import { HostGuidelinesPage } from "./components/HostGuidelinesPage";
import { TermsPage } from "./components/TermsPage";
import { CustomerTermsPage } from "./components/CustomerTermsPage";

function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden font-['Satoshi',sans-serif]">
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

export default function App() {
  const path =
    typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") : "";

  if (path === "/host-onboarding") {
    return <HostOnboardingPage />;
  }

  if (path === "/host-guidelines") {
    return <HostGuidelinesPage />;
  }

  // Public /terms shows the customer (User) T&Cs. Host Terms live at
  // /host-terms (hosts also read them in-app in the vendor app).
  if (path === "/terms") {
    return <CustomerTermsPage />;
  }

  if (path === "/host-terms") {
    return <TermsPage />;
  }

  return <LandingPage />;
}

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
import { PrivacyPage } from "./components/PrivacyPage";
import { DeleteAccountPage } from "./components/DeleteAccountPage";
import { ChildSafetyPage } from "./components/ChildSafetyPage";
import AdminDashboard from "./AdminDashboard";

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

  if (path === "/privacy") {
    return <PrivacyPage />;
  }

  // Internal metrics dashboard. Gated by Supabase auth + the is_admin flag —
  // the page itself is public, but it shows nothing without an admin account.
  if (path === "/admin") {
    return <AdminDashboard />;
  }

  // Account-deletion instructions — required by Google Play's account-deletion
  // policy; this URL goes in Play Console → App content → Data safety.
  if (path === "/delete-account") {
    return <DeleteAccountPage />;
  }

  // Child-safety (CSAE) standards — required by Google Play's Child Safety
  // Standards policy; the URL goes in Play Console → App content.
  if (path === "/child-safety") {
    return <ChildSafetyPage />;
  }

  return <LandingPage />;
}

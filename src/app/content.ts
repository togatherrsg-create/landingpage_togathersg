// ==========================================
// TOGATHERSG CONTENT CONFIGURATION
// ==========================================
// Edit this file to update all text, images, and links on the landing page.
// No code changes required - just update the values below.

export const siteContent = {
  // ==========================================
  // HEADER / NAVIGATION
  // ==========================================
  header: {
    logo: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=100&h=100&fit=crop", // Replace with your logo
    logoText: "ToGatherSG", // Optional text next to logo (can be empty "")
    navigation: [
      { label: "Home", href: "#home" },
      { label: "Media", href: "#featured-in" },
      { label: "Host With Us", href: "#host-with-us" },
      { label: "Meet The Team", href: "#meet-the-team" },
      { label: "Contact", href: "#contact" },
      { label: "Download Now", href: "#download-now" },
    ],
  },

  // ==========================================
  // SECTION 1: HOME
  // ==========================================
  home: {
    title: "Singapore's first marketplace for Home-based Experiences",
    subtitle: "Join Singapore's vibrant community of learners and hosts creating meaningful experiences through home-based workshops and gatherings.",
    heroImage: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    buttons: [
      {
        label: "Download Now",
        href: "#download-now", // Scroll link
        type: "primary" as const,
      },
      {
        label: "Become a Host",
        href: "#host-with-us", // Scroll link
        type: "secondary" as const,
      },
    ],
  },

  // ==========================================
  // SECTION 2: FEATURED IN
  // ==========================================
  featuredIn: {
    title: "Media",
    subtitle: " ",
    articleImage: "https://images.unsplash.com/photo-1624269305548-1527ef905ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
  },

  // ==========================================
  // SECTION 3: HOST WITH US
  // ==========================================
  hostWithUs: {
    title: "Share Your Passion, Build Your Community.",
    subtitle: "Turn your skills and home into a space for connection. Hosting with ToGatherSG is rewarding, flexible, and fun.",
    benefits: [
      {
        icon: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=80&h=80&fit=crop",
        title: "Get Discovered",
        description: "Reach more people! Be visible to neighbours or anyone looking to learn what you have to offer.",
      },

      {
        icon: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=80&h=80&fit=crop",
        title: "Earn Easily",
        description: "Earn at your own rates. Seamless payments in the app make cancellations easier",
      },
      {
        icon: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=80&h=80&fit=crop",
        title: "Track Your Growth",
        description: "Clear visual insights into your bookings and earnings over time.",
      },
      {
        icon: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=80&h=80&fit=crop",
        title: "ToGatherSG Support",
        description: "Direct and ongoing support from our team for guidance and resources",
      },

    ],
    ctaButton: {
      label: "Start Hosting Today",
      href: "/host-onboarding", // Opens the on-page host onboarding guide
      type: "external" as const,
    },
  },

  // ==========================================
  // SECTION 4: MEET THE TEAM
  // ==========================================
  meetTheTeam: {
    title: "Meet The Team",
    subtitle: "We’re a passionate team building ToGatherSG to help people share what they love, discover meaningful experiences and connect through doing. Meet the team behind ToGatherSG!",
    team: [
      {
        photo: "/team/sabrina.jpg",
        name: "Sabrina",
        role: "Lead & Visionary",
        bio: "I'm inspired by the people I meet and the things I learn along the way. Everyone has a story worth sharing, sometimes all it takes is one shared passion to bring us together.",
      },
      {
        photo: "/team/min-hui.jpg",
        name: "Min Hui",
        role: "Marketing & Community Growth",
        bio: "I love trying new things and believe people bond more deeply through shared experiences. Here's to creating more moments of fun and connection!",
      },
    ],
  },

  // ==========================================
  // SECTION 5: CONTACT
  // ==========================================
  contact: {
    title: "Get In Touch",
    subtitle: "Got questions or feedback? We would love to hear from you.",
    contactInfo: {
      email: "admin@togathersg.com",
      phone: "+65 8659 6838",
      instagram: "@togather_sg",
    },
    form: {
      namePlaceholder: "Your Name",
      emailPlaceholder: "your.email@example.com",
      phonePlaceholder: "+65 1234 5678",
      messagePlaceholder: "Tell us what's on your mind...",
      submitButton: "Send Message",
    },
  },

  // ==========================================
  // SECTION 6: DOWNLOAD NOW
  // ==========================================
  downloadNow: {
    title: "Download ToGatherSG",
    subtitle: "Discover unique experiences and connect with your community.",
    appScreenshot: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    description: "Browse workshops, book experiences and connect with amazing hosts—all from your phone.",
    buttons: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/sg/app/togathersg/id6758666107/", // External URL - edit this
        type: "primary" as const,
      },
      {
        label: "Android Coming Soon",
        href: "#",
        type: "disabled" as const,
      },
    ],
  },

  // ==========================================
  // FOOTER
  // ==========================================
  footer: {
    logo: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=100&h=100&fit=crop", // Replace with your logo
    tagline: "Bringing people together to share meaningful experiences, explore, and learn from one another.",
    socialMedia: [
      { platform: "Instagram", url: "https://instagram.com/togather_sg" },
      { platform: "Facebook", url: "https://facebook.com/togather_sg" },
    ],
    navigation: [
      { label: "Home", href: "#home" },
      { label: "Media", href: "#featured-in" },
      { label: "Host With Us", href: "#host-with-us" },
      { label: "Meet The Team", href: "#meet-the-team" },
      { label: "Contact", href: "#contact" },
      { label: "Download Now", href: "#download-now" },
    ],
    additionalLinks: [
      { label: "Host Onboarding Guide", href: "/host-onboarding" },
      { label: "Host Standards & Safety Guidelines", href: "/host-guidelines" },
      { label: "Terms and Conditions", href: "/terms" },
    ],
  },
};

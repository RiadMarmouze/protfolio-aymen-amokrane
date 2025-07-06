import { FooterData } from "@/components/common/Footer/FooterTypes";

export const footerData: FooterData = {
  news: [
    {
      id: "news1",
      date: "Jul 01, 2025",
      title: "Guggenheim Fellowship",
      image: "/images/news-guggenheim.jpg",
      description:
        "On the organization's 100th anniversary, Matt Willey and team collaborate with the John Simon Guggenheim Memorial Foundation on a brand identity redesign, with strategy from Michael Bierut.",
    },
    {
      id: "news2",
      date: "Jun 27, 2025",
      title: "Nike Breaking4",
      image: "/images/news-nike.jpg",
      description:
        "Eddie Opara, Giorgia Lupi and teams design a data-driven visual language for Faith Kipyegon's moonshot attempt to break the 4-minute mile.",
    },
  ],
  events: [
    {
      id: "event1",
      date: "Jul 11, 2025",
      title: "Jon Marshall at Goodwood Festival of Speed STEM Schools Seminars",
    },
    {
      id: "event2",
      date: "Jul 18, 2025",
      title: "Jon Marshall at Proxectar: Conversations about Design",
    },
  ],
  contact: [
    { location: "London", email: "london@pentagram.com" },
    { location: "New York", email: "newyork@pentagram.com" },
    { location: "Austin", email: "austin@pentagram.com" },
    { location: "Berlin", email: "info@pentagram.de" },
  ],
  about:
    "Pentagram is the world's most acclaimed creative collective, where 23 partners work independently and collaboratively to shape the future of design. Guided by curiosity and intellect, we create work that redefines ideas, shifts perceptions, and leaves an imprint across disciplines and industries.",
  socialLinks: [
    { name: "Instagram", url: "https://instagram.com", icon: "instagram" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { name: "X", url: "https://twitter.com", icon: "twitter" },
    { name: "Facebook", url: "https://facebook.com", icon: "facebook" },
  ],
  footerLinks: [
    { name: "Newsletter", url: "/newsletter" },
    { name: "Careers", url: "/careers" },
    { name: "Privacy Policy", url: "/privacy" },
  ],
  copyright: "© 1972 – 2025 Pentagram",
};

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  image: string;
  description: string;
}

export interface EventItem {
  id: string;
  date: string;
  title: string;
}

export interface ContactInfo {
  location: string;
  email: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface FooterData {
  news: NewsItem[];
  events: EventItem[];
  contact: ContactInfo[];
  about: string;
  socialLinks: SocialLink[];
  footerLinks: { name: string; url: string }[];
  copyright: string;
}

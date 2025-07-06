"use client";
"use client";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FooterData,
} from "@/components/common/Footer/FooterTypes";

interface FooterProps {
  data: FooterData;
}

export const Footer: FC<FooterProps> = ({ data }) => {
  const [loadedNews, setLoadedNews] = useState<Set<string>>(new Set());

  const handleNewsImageLoad = (id: string) => {
    setLoadedNews((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  return (
    <footer className="bg-black text-white px-4 md:px-12 pt-6 pb-24 font-sans">
      {/* Top: News & Events */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-6">
        <h2 className="text-sm flex-1 mb-4 font-bold sr-only md:not-sr-only">
          News & Events
        </h2>
        <div>
          <h3 className="text-sm mb-4 font-bold md:sr-only">News</h3>
          {data.news.map((item, i) => (
            <article
              key={item.id}
              className={`flex flex-col md:flex-row gap-4 ${
                i !== 0 ? "border-t border-gray-800" : ""
              } py-4`}
            >
              <div className="relative aspect-[3/2] w-full md:w-64 flex-shrink-0 overflow-hidden">
                {!loadedNews.has(item.id) && (
                  <div className="absolute inset-0 bg-gray-700 animate-pulse" />
                )}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    loadedNews.has(item.id) ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadingComplete={() => handleNewsImageLoad(item.id)}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 256px"
                />
              </div>
              <div>
                <span className="text-xs uppercase text-gray-400">Work</span>
                <time dateTime={item.date} className="text-sm text-gray-400">
                  {item.date}
                </time>
                <h4 className="text-base font-medium text-white mt-1 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            </article>
          ))}

          <h3 className="text-sm mb-4 font-bold md:sr-only">Events</h3>
          {data.events.map((event) => (
            <article key={event.id} className="mb-2 border-t border-gray-800 py-4">
              <span className="text-xs uppercase text-gray-400">Event</span>
              <time dateTime={event.date} className="text-sm text-gray-400">
                {event.date}
              </time>
              <h4 className="text-sm text-white font-medium mt-1">
                {event.title}
              </h4>
            </article>
          ))}
          <Link
            href="#"
            className="text-sm underline text-white hover:opacity-80 mt-2 inline-block"
            aria-label="View all news and events"
          >
            See all news
          </Link>
        </div>
      </section>

      {/* Middle: Contact + About */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-800 pt-8 mb-20">
        <h2 className="text-sm flex-1 mb-4 font-bold">New Business Inquiries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <address className="space-y-2 not-italic">
            {data.contact.map((c, i) => (
              <div key={`location-${i}`}>{c.location}</div>
            ))}
          </address>
          <div className="space-y-2 text-gray-400">
            {data.contact.map((c, i) => (
              <div key={`email-${i}`}>
                <a
                  href={`mailto:${c.email}`}
                  className="hover:text-white transition-colors"
                  aria-label={`Email ${c.location}`}
                >
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-800 pt-8 mb-20">
        <h2 className="text-sm flex-1 mb-4 font-bold">About</h2>
        <div>
          <p className="text-sm text-gray-400">{data.about}</p>
        </div>
      </section>

      {/* Bottom: Branding + Links */}
      <section className="max-w-7xl w-full mx-auto flex flex-col justify-between items-start gap-8">
        {/* Logo Wordmark */}
        <div className="text-[60px] md:text-[260px] font-serif text-center leading-none">
          Pentagram
        </div>

        {/* Footer Links Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 text-sm w-full">
          {/* Social Links */}
          <nav aria-label="Social media links">
            <ul className="flex flex-wrap gap-4">
              {data.socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-gray-400 hover:text-white flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${link.name}`}
                  >
                    {/* {link.icon && (
                      <span className="inline-block w-4 h-4">
                        {link.icon}
                      </span>
                    )} */}
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Page Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-4">
              {data.footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-gray-400 hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Copyright */}
          <div className="text-gray-500">{data.copyright}</div>
        </div>
      </section>
    </footer>
  );
};
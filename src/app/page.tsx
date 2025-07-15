"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import "@/app/globals.css";

interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  cta?: {
    text: string;
    link: string;
  };
}

interface ProjectCard {
  id: string;
  title: string;
  image: string;
  href: string;
  tags?: string[];
}

type SimpleQuote = {
  content: string;
  author: string;
};

interface ProjectSection {
  id: string;
  title?: string;
  description?: string;
  style: string;
  quote?: SimpleQuote;
  layout: "grid" | "carousel";
  darkMode?: boolean;
  projects: ProjectCard[];
}

interface HomePageProps {
  heroSlides: HeroSlide[];
  sections: ProjectSection[];
}

const data: HomePageProps = {
  heroSlides: [
    {
      title: "Natural History Museum",
      subtitle: "Moving the Museum from catalogue to catalyst.",
      image: "/images/hero-nhm.jpg",
    },
    {
      title: "Pentagram",
      subtitle: "The world's largest independently owned design studio",
      image: "/images/hero-bg.jpg",
    },
  ],
  sections: [
    {
      id: "1",
      layout: "grid",
      style: "1",
      projects: [
        {
          id: "p1",
          title: "Guggenheim Museum",
          image: "/images/guggenheim.jpg",
          href: "/work/guggenheim",
        },
        {
          id: "p2",
          title: "Experimental Typeface",
          image: "/images/type-experiment.jpg",
          href: "/work/type-experiment",
        },
        {
          id: "p3",
          title: "Futuristic 3D",
          image: "/images/3d-future.jpg",
          href: "/work/3d-future",
        },
        {
          id: "p4",
          title: "Augment Design",
          image: "/images/augment.jpg",
          href: "/work/augment",
        },
        {
          id: "p5",
          title: "3D Can Render",
          image: "/images/can.jpg",
          href: "/work/3d-can",
        },
        {
          id: "p6",
          title: "The Stars Align",
          image: "/images/stars.jpg",
          href: "/work/stars",
        },
      ],
    },
    {
      id: "2",
      layout: "grid",
      style: "2",
      darkMode: true,
      title: "Retrospective: Shakespeare in the Park",
      description:
        "In 1954, impresario Joe Papp began a summer tradition of staging free outdoor performances of Shakespeare, inaugurating the Public Theater’s beloved Shakespeare in the Park festival. Pentagram partner Paula Scher, whose relationship with the Public spans four decades, has designed a new identity for the series for thirty consecutive summers. Each campaign is customized to the season’s theme, creating a highly visible graphic vocabulary for outdoor advertising, social media, and on-site signage.",
      quote: {
        content:
          "Great design can push you out of your aesthetic comfort zone. If it's meaningful to the client, it's the right solution.",
        author: "Jody Hudson-Powell",
      },
      projects: [
        {
          id: "twelve",
          title: "Print & Finishes",
          image: "/images/colors.jpg",
          href: "/work/colors",
        },
        {
          id: "twelve",
          title: "On Design",
          image: "/images/book.jpg",
          href: "/work/on-design",
        },
        {
          id: "twelve",
          title: "Color Labels",
          image: "/images/labels.jpg",
          href: "/work/labels",
        },
        {
          id: "twelve",
          title: "Play Poster",
          image: "/images/poster.jpg",
          href: "/work/poster",
        },
        {
          id: "twelve",
          title: "Retro Cars",
          image: "/images/retro.jpg",
          href: "/work/retro",
        },
        {
          id: "twelve",
          title: "Shakespeare in the Park",
          image: "/images/shakespeare.jpg",
          href: "/work/shakespeare",
        },
      ],
    },
    {
      id: "3",
      layout: "grid",
      style: "1",
      projects: [
        {
          id: "twelve",
          title: "Twelve Labs",
          image: "/images/twelve.jpg",
          href: "/projects/twelve",
        },
        {
          id: "twelve",
          title: "Strike Motion",
          image: "/images/strike.jpg",
          href: "/projects/strike",
        },
        {
          id: "twelve",
          title: "SVA NYC",
          image: "/images/sva.jpg",
          href: "/projects/sva",
        },
        {
          id: "twelve",
          title: "Film Series",
          image: "/images/film.jpg",
          href: "/projects/film",
        },
        {
          id: "twelve",
          title: "24Hrs Motion",
          image: "/images/24hrs.jpg",
          href: "/projects/24hrs",
        },
        {
          id: "twelve",
          title: "Geometric Installations",
          image: "/images/geo.jpg",
          href: "/projects/geo",
        },
      ],
    },
  ],
};
const FloatingSearch: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('section[class*="h-[80vh]"]');
    if (!hero) return;

    const handleScroll = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      setStuck(heroBottom < 0);
    };

    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-in-out z-40 ${
        stuck
          ? "fixed bottom-6 left-1/2 -translate-x-1/2"
          : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      }`}
    >
      <div className="backdrop-blur-md bg-white/30 border border-white/50 text-black py-2 pl-6 rounded-md shadow-lg flex items-center gap-3">
        <span className="font-medium">We design</span>
        <CustomSelect options={["Brand Identity", "Digital"]} />
        <span className="font-medium">For</span>
        <CustomSelect options={["Arts & Culture", "Education"]} />
      </div>
    </div>
  );
};

const CustomSelect: FC<{ options: string[] }> = ({ options }) => {
  const [selected, setSelected] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-44" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full cursor-pointer py-2 pl-4 pr-10 text-center font-bold text-black focus:outline-none"
      >
        {selected}
        {/* Chevron SVG */}
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <ul className="absolute z-10 mt-6 max-h-60 w-full overflow-auto rounded-lg bg-white/30 backdrop-blur-md border border-white/50 text-black shadow-lg font-bold">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
              className="cursor-pointer select-none px-4 py-2 hover:bg-black/20 text-gray-900"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const HeroCarousel: FC<{ slides: HeroSlide[] }> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(() => Array(slides.length).fill(false));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleImageLoad = (index: number) => {
    setLoaded((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  useEffect(() => {
    if (!hovered && slides.length > 1) {
      intervalRef.current = setInterval(nextSlide, 6000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [hovered, slides.length, nextSlide]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  if (!slides.length) {
    return (
      <section className="h-[90vh] flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-500">No slides available</p>
      </section>
    );
  }

  return (
    <section
      className="relative h-[90vh] overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-roledescription="carousel"
    >
      <FloatingSearch/>
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              current === index
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={current !== index}
          >
            {!loaded[index] && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
            )}

            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index < 2}
              className="object-cover"
              onLoadingComplete={() => handleImageLoad(index)}
              quality={index === current ? 90 : 30}
              loading={index < 2 ? "eager" : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+"
              sizes="100vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 lg:p-16 flex flex-col justify-end text-white z-10">
              <div className="max-w-2xl">
                <h1 className="text-4xl lg:text-7xl font-bold">
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className="mt-4 text-xl">{slide.subtitle}</p>
                )}
                {slide.cta && (
                  <a
                    href={slide.cta.link}
                    className="mt-6 inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  >
                    {slide.cta.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-8 md:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-8 md:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Progress indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8  transform right-4 z-20 w-full max-w-7xl px-4 sm:px-6">
          <div className="flex justify-end space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-8 w-8 max-w-[50px] rounded-full transition-all duration-300 ${
                  index === current ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
const ProjectGridStyle1: FC<ProjectSection> = ({
  title,
  description,
  quote,
  projects,
  style,
  darkMode,
}) => {
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedIndices((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  return (
    <section
      className={`${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      } py-12  flex flex-col gap-8 px-4`}
    >
      {title && description && (
        <div className="flex flex-col text-left max-w-6xl w-full mx-auto">
          {title && <h2 className="text-3xl font-bold w-1/2 mb-6">{title}</h2>}
          {description && (
            <h2 className="text-base text-gray-500 w-1/2">{description}</h2>
          )}
        </div>
      )}
      {style == "1" ? (
        <div className="grid sm:grid-cols-2 w-full md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Link key={project.id} href={project.href} className="group">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                {!loadedIndices.has(index) && (
                  <div
                    className={`absolute inset-0 ${
                      darkMode ? "bg-gray-700" : "bg-gray-300"
                    } animate-pulse`}
                  />
                )}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                    loadedIndices.has(index) ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadingComplete={() => handleImageLoad(index)}
                  quality={85}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{project.title}</h3>
              {project.tags && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {project.tags.join(", ")}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto overflow-hidden relative">
          {/* Gradient edges */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent dark:from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-transparent dark:from-black to-transparent z-10 pointer-events-none" />

          {/* Marquee content */}
          <div className="flex animate-marquee whitespace-nowrap will-change-transform">
            {[...projects, ...projects].map((project, index) => {
              const originalIndex = index % projects.length;

              return (
                <Link
                  key={`${project.id}-${index}`}
                  href={project.href}
                  className="group w-[250px] mx-4 shrink-0 aspect-[1/1.5]"
                >
                  <h3 className="mb-2 text-sm font-medium truncate">
                    {project.title}
                  </h3>
                  <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
                    {!loadedIndices.has(originalIndex) && (
                      <div
                        className={`absolute inset-0 ${
                          darkMode ? "bg-gray-800" : "bg-gray-200"
                        } animate-pulse`}
                      />
                    )}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                        loadedIndices.has(originalIndex)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                      onLoadingComplete={() =>
                        setLoadedIndices((prev) => {
                          const newSet = new Set(prev);
                          newSet.add(originalIndex);
                          return newSet;
                        })
                      }
                      quality={90}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+"
                    />
                  </div>
                  {project.tags && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                      {project.tags.join(", ")}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {quote && (
        <div className="w-full border-t border-gray-800 m-auto flex justify-end max-w-6xl p-6 ">
          <div className="w-4/5">
            <blockquote className="relative italic text-gray-700 text-4xl leading-tight">
              <div className="absolute top-0 left-0 -mt-3 -ml-3 text-6xl text-white font-serif">
                &ldquo;
              </div>
              <p className="pl-8 text-gray-200">{quote.content}</p>
              <div className="absolute bottom-0 rotate-180 right-0 -mb-3 -mr-3 text-6xl text-white font-serif">
                &ldquo;
              </div>
            </blockquote>
            <div className="mt-4 text-right text-gray-400 font-medium">
              — {quote.author}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const HomePage: FC = () => {
  useEffect(() => {
    // Preload hero images using Next.js optimized approach
    data.heroSlides.forEach((slide) => {
      const img = document.createElement("img");
      img.src = slide.image;
      img.fetchPriority = "high";
      document.body.appendChild(img);
      img.remove();
    });
  }, []);

  const { heroSlides, sections } = data;

  return (
    <>
      <Head>
        <title>
          Pentagram | The World&apos;s Largest Independent Design Studio
        </title>
        <meta
          name="description"
          content="Pentagram is the world's largest independently owned design studio, working across branding, digital, architecture, and more."
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        {data.heroSlides.slice(0, 2).map((slide, index) => (
          <link
            key={index}
            rel="preload"
            href={slide.image}
            as="image"
            imageSrcSet={`${slide.image} 1x`}
            imageSizes="100vw"
          />
        ))}
      </Head>

      <main className="min-h-screen mt-16 bg-gray-50 dark:bg-black">
        <HeroCarousel slides={heroSlides} />
        {sections.map((section) => (
          <ProjectGridStyle1 key={section.id} {...section} />
        ))}
      </main>
    </>
  );
};

export default HomePage;

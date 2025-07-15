"use client";

import { useParams, notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import type { FC } from "react";

// -------- Types --------
type MediaContent = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

type TextVariant = "paragraph" | "quote" | "stat" | "list";

type TextContent = {
  variant: TextVariant;
  text: string;
  source?: string;
  value?: string;
  items?: string[];
};

type VideoContent = {
  url: string;
  thumbnail?: string;
  caption?: string;
  aspectRatio?: string;
};

type Section =
  | {
      type: "image";
      content: MediaContent;
      caption?: string;
    }
  | {
      type: "text";
      content: TextContent;
    }
  | {
      type: "video";
      content: VideoContent;
    }
  | {
      type: "gallery";
      items: MediaContent[];
      layout: "grid" | "carousel";
    };

type ProjectRole = {
  name: string;
  role: string;
  link?: string;
};

type ProjectPhase = {
  name: string;
  duration: string;
  description: string;
};

type ProjectAward = {
  name: string;
  year: string;
  category?: string;
};

type MetadataGroup = {
  title: string;
  items: {
    key: string;
    value: string;
    link?: string;
    notes?: string;
  }[];
};

type InfoPanel = {
  subtitle: string;
  tags: string[];
  overview: {
    heading?: string;
    content: string;
    link?: string;
  }[];
  challenges: {
    problem: string;
    solution: string;
  }[];
  process: ProjectPhase[];
  team: ProjectRole[];
  collaborators?: {
    name: string;
    role: string;
    link?: string;
  }[];
  awards?: ProjectAward[];
  metadata: MetadataGroup[];
  acknowledgments?: string[];
};

type Project = {
  id: string;
  title: string;
  coverImage: MediaContent;
  infoPanel: InfoPanel;
  sections: Section[];
  timeline: {
    start: string;
    end?: string;
    status?: "completed" | "ongoing" | "paused";
  };
  links?: {
    label: string;
    url: string;
    type: "case-study" | "live-site" | "press";
  }[];
};

// -------- Data --------
const projects: Project[] = [
  {
    id: "twelve",
    title: "Twelve Labs",
    coverImage: {
      url: "/images/twelve.jpg",
      alt: "Twelve Labs cover image",
      width: 1200,
      height: 800,
    },
    timeline: {
      start: "January 2023",
      end: "June 2023",
      status: "completed",
    },
    links: [
      {
        label: "Visit Website",
        url: "https://twelvelabs.io",
        type: "live-site",
      },
      {
        label: "Case Study",
        url: "https://portfolio.com/twelve-case-study",
        type: "case-study",
      },
    ],
    infoPanel: {
      subtitle: "AI video understanding platform",
      tags: ["AI", "Brand Design", "UX/UI", "Frontend Development"],
      overview: [
        {
          heading: "Project Vision",
          content:
            "Twelve Labs is pioneering multi-modal AI video search technology that understands context, objects, and actions within video content. The platform represents a significant leap forward in machine understanding of visual media, enabling users to search video content as easily as they search text documents.",
          link: "https://techcrunch.com/twelve-labs-launch",
        },
        {
          content:
            "Our team was tasked with creating a comprehensive brand identity and user experience that communicates the technical sophistication while remaining approachable for non-technical users. The challenge was to visually represent complex AI capabilities in a way that would resonate with both enterprise clients and the developer community.",
        },
      ],
      challenges: [
        {
          problem:
            "Communicating complex AI capabilities in simple visual language that appeals to both technical and non-technical audiences",
          solution:
            "Developed a dynamic logo system and visual metaphors that grow with the product, using progressive disclosure of complexity. The identity system reveals more technical details as users engage deeper with the platform.",
        },
        {
          problem:
            "Designing for rapidly evolving feature set in an early-stage startup environment where product direction could change weekly",
          solution:
            "Created modular design system with atomic components that could be recombined. Established design tokens and variables that allowed for quick theming adjustments as the product evolved.",
        },
      ],
      process: [
        {
          name: "Discovery",
          duration: "3 weeks",
          description:
            "Conducted stakeholder interviews with founders and engineering team. Analyzed competitive landscape in AI/ML space. Performed technical deep dive to understand platform capabilities and roadmap.",
        },
        {
          name: "Concept Development",
          duration: "4 weeks",
          description:
            "Created brand exploration with 3 distinct directions. Developed mood boards exploring visual metaphors for AI understanding. Designed initial UX flows for core search functionality.",
        },
        {
          name: "Design Phase",
          duration: "6 weeks",
          description:
            "Produced high-fidelity prototypes for key user flows. Built comprehensive design system with typography, color, and component libraries. Conducted user testing with both technical and non-technical users.",
        },
        {
          name: "Implementation",
          duration: "8 weeks",
          description:
            "Collaborated closely with frontend engineering team. Established design QA process to ensure fidelity. Created documentation and training materials for internal team.",
        },
      ],
      team: [
        {
          name: "Jane Smith",
          role: "Creative Director",
          link: "https://linkedin.com/janesmith",
        },
        {
          name: "John Doe",
          role: "Lead Designer",
          link: "https://linkedin.com/johndoe",
        },
        {
          name: "Alex Chen",
          role: "Frontend Developer",
          link: "https://linkedin.com/alexchen",
        },
        {
          name: "Maria Garcia",
          role: "UX Researcher",
          link: "https://linkedin.com/mariagarcia",
        },
      ],
      collaborators: [
        {
          name: "OpenAI Design Team",
          role: "Technical Consultants",
          link: "https://openai.com",
        },
        {
          name: "Stanford HCI Lab",
          role: "Research Partners",
          link: "https://hci.stanford.edu",
        },
      ],
      awards: [
        {
          name: "Webby Awards",
          year: "2023",
          category: "Best Visual Design - Function",
        },
        {
          name: "Awwwards",
          year: "2023",
          category: "Site of the Day",
        },
        {
          name: "CSS Design Awards",
          year: "2023",
          category: "Special Kudos",
        },
      ],
      metadata: [
        {
          title: "Project Details",
          items: [
            { key: "Client", value: "Twelve Labs Inc." },
            { key: "Office", value: "San Francisco, CA" },
            { key: "Project Duration", value: "6 months" },
            { key: "Budget", value: "$250,000", notes: "Design + Development" },
            { key: "Team Size", value: "4 core members" },
          ],
        },
        {
          title: "Technical Specs",
          items: [
            { key: "Platform", value: "Web Application" },
            { key: "Tech Stack", value: "React, Next.js, Tailwind CSS" },
            { key: "Design Tools", value: "Figma, Adobe Suite, Blender" },
            { key: "Design System", value: "Fully documented in Zeroheight" },
          ],
        },
        {
          title: "Sector & Discipline",
          items: [
            { key: "Industry", value: "Artificial Intelligence" },
            {
              key: "Disciplines",
              value: "Brand Identity, UX/UI Design, Frontend Development",
            },
            {
              key: "Services",
              value: "Strategy, Visual Design, Interaction Design, Development",
            },
          ],
        },
      ],
      acknowledgments: [
        "Special thanks to the Twelve Labs engineering team for their collaboration and technical guidance throughout the project",
        "Featured in TechCrunch, Wired, and The Verge for innovative design approach",
        "Selected as case study in 2023 AI Design Patterns report",
      ],
    },
    sections: [
      {
        type: "image",
        content: {
          url: "/images/projects/twelve/twelve-1.jpg",
          alt: "Brand identity system showing logo variations",
          width: 1200,
          height: 800,
        },
        caption:
          "Brand identity system showing the dynamic logo variations that adapt to different contexts",
      },
      {
        type: "text",
        content: {
          variant: "paragraph",
          text: "The visual identity needed to communicate both the technical sophistication of the AI platform and its approachable nature. We developed a color palette that balanced corporate seriousness with technological vibrancy, using deep blues as a foundation with electric teal accents. The typography system combines the stability of a geometric sans-serif for headings with a more humanist sans for body text, creating a subtle tension between the mechanical and human elements of the technology.",
        },
      },
      {
        type: "video",
        content: {
          url: "/videos/projects/twelve/twelve-demo.mp4",
          thumbnail: "/images/projects/twelve/twelve-video-thumb.jpg",
          caption: "Product demo showing the video search interface in action",
          aspectRatio: "16/9",
        },
      },
      {
        type: "text",
        content: {
          variant: "quote",
          text: "Working with the design team transformed how we present our technology to the world. They managed to capture both the power and accessibility of our platform in a visual language that resonates with all our target audiences.",
          source: "Dr. Sarah Johnson, CTO of Twelve Labs",
        },
      },
      {
        type: "image",
        content: {
          url: "/images/projects/twelve/twelve-2.jpg",
          alt: "User interface showing search results",
          width: 1200,
          height: 800,
        },
        caption:
          "The search results interface uses spatial organization and visual hierarchy to help users quickly understand relationships between video segments",
      },
      {
        type: "text",
        content: {
          variant: "paragraph",
          text: 'The user interface was designed around the concept of progressive disclosure, revealing complexity only as needed. The initial search experience is deliberately simple - a single search box with subtle animation to suggest the AI is "thinking". As users refine their searches, additional filters and controls appear contextually. We developed a unique visualization system for search results that shows temporal relationships between video segments while maintaining clear visual hierarchy.',
        },
      },
    ],
  },
];

// -------- Components --------
const MetadataGroup: FC<{ group: MetadataGroup }> = ({ group }) => (
  <div className="mb-6">
    <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-gray-700">
      {group.title}
    </h3>
    <div className="space-y-1">
      {group.items.map((item, index) => (
        <div key={index} className="flex text-sm">
          <span className="w-1/3 font-medium text-gray-800">{item.key}</span>
          <span className="w-2/3 text-gray-700">
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
            {item.notes && (
              <span className="text-xs text-gray-500 block">{item.notes}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const ProcessPhase: FC<{ phase: ProjectPhase }> = ({ phase }) => (
  <div className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
    <div className="flex justify-between items-start">
      <h4 className="font-medium text-gray-800">{phase.name}</h4>
      <span className="text-xs bg-gray-200 text-black px-2 py-1">
        {phase.duration}
      </span>
    </div>
    <p className="text-sm text-gray-700 mt-1">{phase.description}</p>
  </div>
);

// -------- Page --------
const ProjectPage: FC = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [showInfo, setShowInfo] = useState(true);

  if (!project) return notFound();

  const handleToggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <main className="flex flex-col mt-16">
      <div className="w-full p-6 relative">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl text-black font-bold mb-1">
                {project.title}
              </h1>
              <p className="text-sm text-gray-600">
                {project.infoPanel.subtitle}
              </p>
            </div>
            <span className="text-xs bg-black text-white px-2 py-1">
              {project.timeline.status === "completed"
                ? `Completed ${project.timeline.end}`
                : "Ongoing"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.infoPanel.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-black text-white px-2 py-1 rounded-none"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {project.links && project.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs border border-black text-black px-3 py-1 hover:bg-black hover:text-white transition-colors flex items-center gap-1"
              >
                {link.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="inline-block"
                >
                  <path
                    d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            ))}
          </div>
        )}
        {/* Toggle Button */}
        <button
          onClick={handleToggleInfo}
          className="fixed md:absolute bottom-6 right-6 bg-black text-white px-4 py-2 text-xs rounded-none z-30"
        >
          {showInfo ? "Hide Info" : "About the project"}
        </button>

        {/* Mobile overlay close button */}
        {showInfo && (
          <button
            onClick={handleToggleInfo}
            className="fixed md:hidden top-4 left-4 bg-black text-white px-4 py-2 text-xs rounded-none z-30"
          >
            Close
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row relative bg-white">
        {/* LEFT COLUMN: Scrollable gallery */}
        <div
          className={`flex-1 overflow-y-auto p-6 space-y-10 transition-transform duration-300 ease-in-out 
          ${showInfo ? "translate-x-0 w-full md:w-1/2" : " w-full"}`}
        >
          {project.sections.map((section, i) => (
            <div key={i} className="mb-10 last:mb-0">
              {section.type === "image" && (
                <figure>
                  <Image
                    src={section.content.url}
                    alt={section.content.alt}
                    width={section.content.width}
                    height={section.content.height}
                    className="w-full rounded-none object-cover"
                  />
                  {section.caption && (
                    <figcaption className="text-xs text-gray-500 mt-1">
                      {section.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              {section.type === "text" && (
                <div
                  className={`
                ${
                  section.content.variant === "quote"
                    ? "border-l-2 border-gray-300 pl-4"
                    : ""
                }
                ${
                  section.content.variant === "stat"
                    ? "text-4xl font-light"
                    : "text-base"
                }
              `}
                >
                  <p className="text-gray-800 leading-relaxed">
                    {section.content.text}
                  </p>
                  {section.content.source && (
                    <p className="text-xs text-gray-500 mt-1">
                      — {section.content.source}
                    </p>
                  )}
                  {section.content.value && (
                    <p className="text-xs text-gray-500 mt-1">
                      {section.content.value}
                    </p>
                  )}
                </div>
              )}

              {section.type === "video" && (
                <figure>
                  <video
                    src={section.content.url}
                    controls
                    poster={section.content.thumbnail}
                    className={`w-full ${
                      section.content.aspectRatio === "16/9"
                        ? "aspect-video"
                        : "aspect-auto"
                    }`}
                  />
                  {section.content.caption && (
                    <figcaption className="text-xs text-gray-500 mt-1">
                      {section.content.caption}
                    </figcaption>
                  )}
                </figure>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Enhanced Info panel */}
        <div
          className={`
            fixed inset-0 md:sticky md:top-16 h-screen overflow-hidden bg-gray-100 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${
              showInfo
                ? "translate-x-0 w-full md:w-1/2"
                : "translate-x-full w-0"
            }
            z-20
         `}
        >
          <div className="p-6">
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 border-b text-black border-gray-300 pb-1">
                Overview
              </h2>
              <div className="space-y-4 text-sm text-gray-800">
                {project.infoPanel.overview.map((item, index) => (
                  <div key={index}>
                    {item.heading && (
                      <h3 className="font-medium mb-1">{item.heading}</h3>
                    )}
                    <p className="leading-relaxed">
                      {item.content}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 underline ml-1"
                        >
                          ↗
                        </a>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges & Solutions */}
            {project.infoPanel.challenges &&
              project.infoPanel.challenges.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3 border-b text-black border-gray-300 pb-1">
                    Challenges
                  </h2>
                  <div className="space-y-4">
                    {project.infoPanel.challenges.map((challenge, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium text-gray-800">
                          Problem: {challenge.problem}
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          Solution: {challenge.solution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Process */}
            {project.infoPanel.process &&
              project.infoPanel.process.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3 border-b text-black border-gray-300 pb-1">
                    Process
                  </h2>
                  <div className="space-y-0">
                    {project.infoPanel.process.map((phase, index) => (
                      <ProcessPhase key={index} phase={phase} />
                    ))}
                  </div>
                </div>
              )}

            {/* Team */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 border-b text-black border-gray-300 pb-1">
                Team
              </h2>
              <div className="space-y-2 text-sm">
                {project.infoPanel.team.map((member, index) => (
                  <div key={index}>
                    <p className="font-medium text-gray-800">
                      {member.link ? (
                        <a
                          href={member.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {member.name}
                        </a>
                      ) : (
                        member.name
                      )}
                    </p>
                    <p className="text-gray-700">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaborators */}
            {project.infoPanel.collaborators &&
              project.infoPanel.collaborators.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3 border-b text-black border-gray-300 pb-1">
                    Collaborators
                  </h2>
                  <div className="space-y-2 text-sm">
                    {project.infoPanel.collaborators.map(
                      (collaborator, index) => (
                        <div key={index}>
                          <p className="font-medium text-gray-800">
                            {collaborator.link ? (
                              <a
                                href={collaborator.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {collaborator.name}
                              </a>
                            ) : (
                              collaborator.name
                            )}
                          </p>
                          <p className="text-gray-700">{collaborator.role}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Metadata Groups */}
            <div className="space-y-6">
              {project.infoPanel.metadata.map((group, index) => (
                <MetadataGroup key={index} group={group} />
              ))}
            </div>

            {/* Awards */}
            {project.infoPanel.awards &&
              project.infoPanel.awards.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-gray-700">
                    Awards & Recognition
                  </h3>
                  <div className="space-y-2 text-sm">
                    {project.infoPanel.awards.map((award, index) => (
                      <div key={index}>
                        <p className="font-medium text-gray-800">
                          {award.name} ({award.year})
                        </p>
                        {award.category && (
                          <p className="text-gray-700">{award.category}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Acknowledgments */}
            {project.infoPanel.acknowledgments && (
              <div className="text-xs text-gray-600 mt-6 pt-4 border-t border-gray-300">
                <h4 className="font-medium mb-1">Acknowledgments</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {project.infoPanel.acknowledgments.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectPage;

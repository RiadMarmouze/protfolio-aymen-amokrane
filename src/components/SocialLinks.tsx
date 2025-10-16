import Link from "next/link";
import { Instagram, Dribbble, Github, Linkedin } from "lucide-react";

export default function SocialLinks() {
  // Replace href values with your real profiles and add rel for external links
  const links = [
    { href: "https://instagram.com/yourhandle", label: "Instagram", Icon: Instagram },
    { href: "https://dribbble.com/yourhandle", label: "Dribbble", Icon: Dribbble },
    { href: "https://github.com/yourhandle", label: "GitHub", Icon: Github },
    { href: "https://www.linkedin.com/in/yourhandle", label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <div className="flex items-center gap-3">
      {links.map(({ href, label, Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={label}
          className="flex p-2 md:p-3 justify-center items-center aspect-square rounded-full border border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <Icon size={16} aria-hidden />
        </Link>
      ))}
    </div>
  );
}
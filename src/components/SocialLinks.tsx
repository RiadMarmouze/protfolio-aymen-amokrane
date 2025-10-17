import Link from "next/link";
import InstagramIcon from "@/icons/social/instagram.svg";
import BehanceIcon from "@/icons/social/behance.svg";
import LinkedinIcon from "@/icons/social/linkedin.svg";

export default function SocialLinks() {
  const links = [
    {
      href: "http://instagram.com/aymen.doinstuff",
      label: "Instagram",
      Icon: InstagramIcon,
    },
    {
      href: "http://behance.net/aymenamok",
      label: "Behance",
      Icon: BehanceIcon,
    },
    {
      href: "https://www.linkedin.com/in/aymen-amokrane-72648a1a9/",
      label: "LinkedIn",
      Icon: LinkedinIcon,
    },
  ];

  return (
    <div className="flex justify-center items-center gap-4">
      {links.map(({ href, label, Icon }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={label}
          className="flex p-3 md:p-4 justify-center items-center aspect-square rounded-full border border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
        >
          <Icon className="w-6 h-6 fill-white stroke-none" />
        </Link>
      ))}
    </div>
  );
}

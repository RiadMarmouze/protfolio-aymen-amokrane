import Link from "next/link";
import Image from "next/image";

export default function SocialLinks() {
  const links = [
    {
      href: "http://instagram.com/aymen.doinstuff",
      label: "Instagram",
      src: "/icons/social/instagram.svg",
    },
    {
      href: "http://behance.net/aymenamok",
      label: "Behance",
      src: "/icons/social/behance.svg",
    },
    {
      href: "https://www.linkedin.com/in/aymen-amokrane-72648a1a9/",
      label: "LinkedIn",
      src: "/icons/social/linkedin.svg",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-4">
      {links.map(({ href, label, src }) => (
        <Link
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer me"
          aria-label={label}
          className="flex p-2 md:p-3 justify-center items-center aspect-square rounded-full border border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 transition-transform duration-200"
        >
          <Image
            src={src}
            alt={label}
            width={24}
            height={24}
            className="w-5 h-5"
          />
        </Link>
      ))}
    </div>
  );
}

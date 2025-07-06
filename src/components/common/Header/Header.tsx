import Link from "next/link";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white text-black shadow-md z-50">
      <Link
        href="/"
        className="text-xl font-bold hover:opacity-80 transition-opacity"
      >
        Pentagram
      </Link>
      <nav className="hidden md:flex space-x-6">
        <Link href="#work" className="hover:underline">
          Work
        </Link>
        <Link href="#about" className="hover:underline">
          About
        </Link>
        <Link href="#news" className="hover:underline">
          News
        </Link>
        <Link href="#contact" className="hover:underline">
          Contact
        </Link>
        <Link href="#search" className="hover:underline">
          🔍
        </Link>
        <Link href="#archive" className="hover:underline">
          Archive
        </Link>
      </nav>
      <button className="md:hidden">☰</button>
    </header>
  );
};

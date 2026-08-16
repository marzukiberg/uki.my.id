import Image from "next/image";
import Link from "next/link";
import AppsMenuButton from "../ui/apps-menu-button";

const Navbar = ({ router }) => {
  return (
    <header className="flex w-full items-center justify-between p-3 md:px-6 md:py-3.5">
      {/* Left side optional Google links */}
      <div className="flex items-center gap-4 text-xs font-normal text-gray-700 md:text-sm">
        <Link
          href="/about"
          className="hover:underline text-gray-700 transition-colors"
        >
          About
        </Link>
        <Link
          href="/#showcases"
          className="hover:underline text-gray-700 transition-colors"
        >
          Portfolio
        </Link>
      </div>

      {/* Right side Google header icons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <a
          href="https://github.com/marzukiberg"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-xs text-gray-700 hover:underline sm:inline-block md:text-sm"
        >
          GitHub
        </a>
        <a
          href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-700 hover:underline md:text-sm"
        >
          Resume
        </a>
        <AppsMenuButton />
        <button
          onClick={() => router.push("/about")}
          className="flex h-9 w-9 items-center justify-center rounded-full p-0.5 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Google Account: Marzuki"
        >
          <Image
            src="/img/profile.jpeg"
            alt="Profile"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import Link from "next/link";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="mt-16 border-t border-[#dadce0] bg-[#f2f2f2] text-xs text-[#70757a]"
    >
      {/* Location / Presence Header Bar like Google */}
      <div className="border-b border-[#dadce0] px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-[#202124]">Indonesia</span>
          <span className="text-[#70757a]">&bull; Available for Remote &amp; Full-time Work</span>
        </div>
      </div>

      {/* Main Bottom Links */}
      <div className="px-6 py-3">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/about" className="hover:text-[#202124] hover:underline">
              About Marzuki
            </Link>
            <Link href="/#showcases" className="hover:text-[#202124] hover:underline">
              Projects &amp; Portfolio
            </Link>
            <a
              href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#202124] hover:underline"
            >
              Resume (ATS)
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a
              href="https://github.com/marzukiberg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#202124] hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/marzukiberg/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#202124] hover:underline"
            >
              LinkedIn
            </a>
            <span>&copy; {new Date().getFullYear()} Ukay.dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

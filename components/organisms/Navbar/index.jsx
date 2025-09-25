import { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import NavLink from "./NavLink";

const MobileSidebar = ({ open, onClose }) => {
  const innerRef = useRef();

  const navCx = open ? "translate-x-0" : "-translate-x-full";

  const handleClose = (e) => {
    if (e.target !== innerRef.current) {
      onClose();
    }
  };

  return (
    <nav
      className={`fixed top-0 z-[999999] h-full w-full backdrop-blur-sm transition-transform duration-300 ease-in-out ${navCx}`}
      onClick={handleClose}
    >
      <div ref={innerRef} className="z-1 h-full w-3/4 bg-white drop-shadow-xl">
        <h4 className="font-qs border-b p-6 text-center text-3xl font-bold">
          Marzuki
        </h4>
        <NavLink title="Home" link="/#" onClick={handleClose} />
        <NavLink title="About" link="/#about" onClick={handleClose} />
        <NavLink title="Skills" link="/#skills" onClick={handleClose} />
        <NavLink title="Portfolio" link="/#portfolio" onClick={handleClose} />
      </div>
    </nav>
  );
};

const Navbar = () => {
  const navbarRef = useRef();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const toggleNav = () => setOpen(!open);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[9999] flex h-16 items-center justify-between transition-colors duration-200 ease-in-out
          ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="hidden gap-8 md:flex">
              <NavLink title="Home" link="/#" />
              <NavLink title="About" link="/#about" />
              <NavLink title="Skills" link="/#skills" />
              <NavLink title="Portfolio" link="/#portfolio" />
            </div>
            <div className="md:hidden">
              <button
                className="h-11 w-11 rounded-lg border border-blue-400 text-blue-400 transition-colors duration-200 hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                onClick={toggleNav}
                aria-label="Toggle navigation menu"
              >
                <i className="fa fa-bars" aria-hidden="true"></i>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="mailto:marzukiberg@gmail.com"
                className="font-qs inline-flex items-center rounded-lg border-2 border-blue-400 bg-transparent px-5 py-2 text-blue-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              >
                Contact
              </a>
              <a
                href="#"
                className="font-qs inline-flex items-center rounded-lg bg-blue-500 px-5 py-2 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16" /> {/* Spacer to prevent content jump */}
      <MobileSidebar open={open} onClose={toggleNav} />
    </>
  );
};

export default Navbar;

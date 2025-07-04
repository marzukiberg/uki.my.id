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
      className={`fixed top-0 z-[999999] h-full w-full backdrop-blur-sm transition-transform ${navCx}`}
      onClick={handleClose}
    >
      <div
        ref={innerRef}
        className={"z-1 h-full w-3/4 bg-white drop-shadow-xl"}
      >
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

  const toggleNav = () => setOpen(!open);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[9999] flex h-16 items-center justify-between px-6 transition-all duration-300
          ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}`}
      >
        <div className="hidden gap-8 md:flex">
          <NavLink title="Home" link="/#" />
          <NavLink title="About" link="/#about" />
          <NavLink title="Skills" link="/#skills" />
          <NavLink title="Portfolio" link="/#portfolio" />
        </div>
        <div className="md:hidden">
          <button
            className="h-11 w-11 rounded-lg border border-blue-400 text-blue-400 transition-all hover:bg-blue-400 hover:text-white"
            onClick={toggleNav}
          >
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="mailto:marzukiberg@gmail.com"
            className={`font-qs inline-flex items-center rounded-lg border-2 border-blue-400 bg-transparent px-5 py-2 text-blue-400 transition-all hover:bg-blue-400 hover:text-white focus:ring ${styles["nav-button"]}`}
          >
            Contact
          </a>
          <a
            href="#"
            className={`font-qs inline-flex items-center rounded-lg bg-blue-500 px-5 py-2 text-white transition-all hover:bg-blue-600 focus:ring`}
          >
            Hire Me
          </a>
        </div>
      </header>
      <div className="h-16" /> {/* Spacer to prevent content jump */}
      <MobileSidebar open={open} onClose={toggleNav} />
      {/* <nav
      className="fixed left-0 top-0 w-full z-[9999] duration-300 flex items-center h-20"
      ref={navbarRef}
      data-aos="slide-down"
    >
      <div className="container mx-auto sm:max-w-3xl md:max-w-6xl p-6 md:p-0">
        <div className="flex justify-between items-center">
          <button
            className="rounded-md border border-blue-400 w-11 h-11 text-blue-400 md:hidden"
            onClick={toggleNav}
          >
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>
          <div
            className={`fixed z-50 left-0 top-0 h-screen w-64 bg-white p-6 drop-shadow-xl md:w-auto md:h-auto md:drop-shadow-none md:p-0 md:bg-transparent md:static md:flex md:space-x-6 transform duration-300 ${
              open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <button
              className="ml-auto block bg-gray-100 w-12 h-12 rounded md:hidden"
              onClick={toggleNav}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
            <NavLink title="Home" link="/#" onClick={toggleNav} />
            <NavLink title="About" link="/#about" onClick={toggleNav} />
            <NavLink title="Skills" link="/#skills" onClick={toggleNav} />
            <NavLink title="Portfolio" link="/#portfolio" onClick={toggleNav} />
          </div>

          <div className="space-x-3">
            <a
              href="#"
              className={`bg-white font-qs inline-block px-4 py-2 text-blue-400 border border-blue-400 rounded-lg hover:shadow-lg focus:ring transition-all duration-300 ${styles['nav-button']}`}
            >
              Contact
            </a>
            <a
              href="#"
              className={`font-qs inline-block px-4 py-2 bg-blue-400 text-white rounded-lg hover:shadow-lg focus:ring transition-all duration-300`}
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav> */}
    </>
  );
};

export default Navbar;

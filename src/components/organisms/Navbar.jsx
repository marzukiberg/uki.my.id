import React, { useEffect, useRef, useState } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const navbarRef = useRef();
  const [open, setopen] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      detectScrolling();
    }
  }, []);

  const detectScrolling = () => {
    window.onscroll = (e) => {
      const doc = document.documentElement;
      const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

      if (top > 100) {
        navbarRef.current.classList.add('bg-white', 'shadow-lg', 'h-16');
      } else {
        navbarRef.current.classList.remove('bg-white', 'shadow-lg', 'h-16');
      }
    };
  };
  const toggleNav = () => setopen(!open);

  return (
    <nav
      className="fixed left-0 top-0 w-full z-50 duration-300 flex items-center h-20"
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
            <a
              href="#"
              className={`block px-6 py-3 md:p-0 md:inline-block hover:bg-blue-400 hover:bg-opacity-50 md:hover:bg-transparent text-black text-opacity-80 font-quicksand relative ${styles['navlink']}`}
            >
              Home
              <div
                className={`${styles['navlink-underline']} hidden md:block`}
              ></div>
            </a>
            <a
              href="#"
              className={`block px-6 py-3 md:p-0 md:inline-block hover:bg-blue-400 hover:bg-opacity-50 md:hover:bg-transparent text-black text-opacity-80 font-quicksand relative ${styles['navlink']}`}
            >
              About
              <div
                className={`${styles['navlink-underline']} hidden md:block`}
              ></div>
            </a>
            <a
              href="#"
              className={`block px-6 py-3 md:p-0 md:inline-block hover:bg-blue-400 hover:bg-opacity-50 md:hover:bg-transparent text-black text-opacity-80 font-quicksand relative ${styles['navlink']}`}
            >
              Skills
              <div
                className={`${styles['navlink-underline']} hidden md:block`}
              ></div>
            </a>
            <a
              href="#"
              className={`block px-6 py-3 md:p-0 md:inline-block hover:bg-blue-400 hover:bg-opacity-50 md:hover:bg-transparent text-black text-opacity-80 font-quicksand relative ${styles['navlink']}`}
            >
              Portfolio
              <div
                className={`${styles['navlink-underline']} hidden md:block`}
              ></div>
            </a>
          </div>

          <div className="space-x-3">
            <a
              href="#"
              className="bg-white font-quicksand inline-block px-4 py-2 text-blue-400 border border-blue-400 rounded-lg hover:shadow-lg focus:ring transition-all duration-300"
            >
              Contact
            </a>
            <a
              href="#"
              className="font-quicksand inline-block px-4 py-2 bg-blue-400 text-white rounded-lg hover:shadow-lg focus:ring transition-all duration-300"
            >
              Hire Me
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

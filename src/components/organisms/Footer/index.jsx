import React from 'react';
import EmailMeSection from './EmailMeSection';
import NameSection from './NameSection';
import PoweredByItem from './PoweredByItem';

const Footer = () => {
  return (
    <footer className="bg-blue-400 relative overflow-x-hidden">
      <div
        className="container mx-auto max-w-7xl p-8 lg:p-16"
        data-aos="fade-in"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <NameSection />
          <EmailMeSection />
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <div
          className="bg-white p-6 mx-3 md:m-0 rounded-xl md:rounded-none md:rounded-tr-xl text-center"
          data-aos="fade-up"
        >
          <div className="max-w-xl mx-auto space-y-3">
            <h4 className="font-quicksand text-lg font-bold">
              This website was powered by
            </h4>
            <div className="flex space-x-6 justify-center">
              <PoweredByItem logo="reactjs.png" text="ReactJS" />
              <PoweredByItem logo="tailwindcss.svg" text="TailwindCSS" />
              <PoweredByItem logo="vite.svg" text="Vite" />
              <PoweredByItem logo="vercel.png" text="Vercel" />
            </div>
          </div>
        </div>

        <div className="container p-6 space-y-3">
          <div className="flex justify-around mx-auto md:ml-auto border-b space-x-3 md:space-x-16 max-w-min p-3">
            <a href="#" className="text-white font-quicksand font-light">
              Home
            </a>
            <a href="#about" className="text-white font-quicksand font-light">
              About
            </a>
            <a href="#skills" className="text-white font-quicksand font-light">
              Skills
            </a>
            <a
              href="#portfolio"
              className="text-white font-quicksand font-light"
            >
              Portfolio
            </a>
          </div>
          <p
            className="text-white font-quicksand text-center md:text-right"
            // data-aos="fade-in"
          >
            UI Design by <b>Alfian Andi Nugraha</b> from Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

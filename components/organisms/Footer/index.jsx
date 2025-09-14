import EmailMeSection from "./EmailMeSection";
import NameSection from "./NameSection";
import PoweredByItem from "./PoweredByItem";

const Footer = () => {
  return (
    <footer className="relative bg-blue-400">
      <div
        className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
        data-aos="fade-in"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <NameSection />
          <EmailMeSection />
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <div
          className="mx-3 overflow-hidden rounded-xl bg-white p-6 text-center md:m-0 md:rounded-none md:rounded-tr-xl"
          data-aos="fade-up"
        >
          <div className="mx-auto max-w-xl space-y-3">
            <h4 className="font-qs text-lg font-bold">
              This website was powered by
            </h4>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <PoweredByItem logo="reactjs.png" text="ReactJS" />
              <PoweredByItem logo="tailwindcss.svg" text="TailwindCSS" />
              <PoweredByItem logo="vite.svg" text="Vite" />
              <PoweredByItem logo="vercel.png" text="Vercel" />
            </div>
          </div>
        </div>

        <div className="container space-y-3 px-4 py-6 sm:px-6 md:ml-auto md:w-2/3 md:space-y-4 md:px-8 md:py-8 lg:px-12 lg:py-12">
          <div className="mx-auto flex max-w-min justify-around space-x-3 border-b p-3 md:mx-0 md:space-x-8 lg:space-x-16">
            <a href="#" className="font-qs font-light text-white">
              Home
            </a>
            <a href="#about" className="font-qs font-light text-white">
              About
            </a>
            <a href="#skills" className="font-qs font-light text-white">
              Skills
            </a>
            <a href="#portfolio" className="font-qs font-light text-white">
              Portfolio
            </a>
          </div>
          <p
            className="font-qs text-center text-white sm:text-right"
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

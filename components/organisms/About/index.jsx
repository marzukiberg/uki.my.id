import React from "react";
import FadeIn from "../../atoms/FadeIn";
import BackgroundAndBlobs from "./BackgroundAndBlobs";
import Interest from "./Interest";
import Socials from "./Socials";

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16">
      <div className="relative ml-0 mr-auto max-w-4xl space-y-6 rounded-r-md bg-blue-400 p-6 sm:p-8 md:w-4/5 md:px-12 md:py-16 lg:px-28 lg:py-24">
        <BackgroundAndBlobs />
        <FadeIn>
          <h2 className="font-poppins text-center text-2xl font-semibold text-white md:text-left md:text-3xl lg:text-4xl">
            About Me
          </h2>
        </FadeIn>
        <FadeIn>
          <p className="font-qs text-center leading-relaxed text-white md:text-left">
            Saya adalah seorang profesional dengan pengalaman 3 tahun di bidang
            pengembangan software yang memiliki ketertarikan mendalam di dunia
            Teknologi Informasi. Selama perjalanan karir saya, saya telah
            menguasai berbagai framework pengembangan software dari native
            hingga modern framework seperti ReactJS, NextJS, React Native,
            Codeigniter dan Laravel. Dengan track record menyelesaikan lebih
            dari 10 project client dan berbagai project profesional, saya tetap
            berkomitmen untuk terus berkembang dan mempelajari
            teknologi-teknologi baru. Bagi saya, pengembangan diri dan
            penguasaan teknologi terkini merupakan investasi yang sangat
            berharga untuk masa depan.
          </p>
        </FadeIn>
        <Socials />

        <Interest />
      </div>
    </section>
  );
};

export default About;

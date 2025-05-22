import React from "react";
import BackgroundAndBlobs from "./BackgroundAndBlobs";
import Interest from "./Interest";
import Socials from "./Socials";

const About = () => {
  return (
    <section id="about">
      <div className="relative inline-block space-y-6 rounded-r-md bg-blue-400 p-6 md:w-4/5 md:px-28 md:py-12">
        <BackgroundAndBlobs />
        <h2
          className="font-poppins text-center text-2xl font-semibold text-white md:text-left md:text-3xl"
          data-aos="slide-right"
        >
          About Me
        </h2>
        <p className="font-qs leading-8 text-white" data-aos="fade-up">
          Saya adalah seorang profesional dengan pengalaman 3 tahun di bidang
          pengembangan software yang memiliki ketertarikan mendalam di dunia
          Teknologi Informasi. Selama perjalanan karir saya, saya telah
          menguasai berbagai framework pengembangan software dari native hingga
          modern framework seperti ReactJS, NextJS, React Native, Codeigniter
          dan Laravel. Dengan track record menyelesaikan lebih dari 10 project
          client dan berbagai project profesional, saya tetap berkomitmen untuk
          terus berkembang dan mempelajari teknologi-teknologi baru. Bagi saya,
          pengembangan diri dan penguasaan teknologi terkini merupakan investasi
          yang sangat berharga untuk masa depan.
        </p>
        <Socials />

        <Interest />
      </div>
    </section>
  );
};

export default About;

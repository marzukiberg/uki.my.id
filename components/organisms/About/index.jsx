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
          Saya adalah seorang yang memiliki ketertarikan di dunia Teknologi
          Informasi, salah satunya dunia pengembangan software. Dalam waktu 1
          tahun saya sudah menguasai beberapa framework dalam pengembangan
          software mulai dari native hingga framework seperti ReactJS, NextJS,
          React Native, Codeigniter dan Laravel. Saya juga sudah menyelesaikan
          lebih dari 10 project permintaan Client Lokal. Namun bagi saya itu
          belum cukup, saya akan terus belajar hal baru karena bagi saya Ilmu
          merupakan Investasi yang sangat menguntungkan di kemudian hari.
        </p>
        <Socials />

        <Interest />
      </div>
    </section>
  );
};

export default About;

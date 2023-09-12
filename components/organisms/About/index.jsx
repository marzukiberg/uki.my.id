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
          Saya adalah seorang yang memiliki ketertarikan di dunia Riset
          Teknologi Informasi dan Machine Learning. Ketertarikan Saya pada dunia
          riset membawa saya bergabung di salah satu komunitas Riset di kampus
          dan saat ini Saya telah banyak mengerjakan riset-riset yang berkaitan
          dengan Teknologi Informasi dan Machine Learning.
        </p>
        <p className="font-qs leading-8 text-white" data-aos="fade-up">
          Berpartisipasi aktif dalam komunitas riset kampus telah memberi saya
          kesempatan untuk bertemu dengan berbagai profesional dan ahli di
          bidangnya, memperluas wawasan saya dan mengasah kemampuan analitis.
          Setiap riset yang saya kerjakan bukan hanya sekedar mengejar hasil,
          melainkan bagaimana saya dapat mengimplementasikan solusi berbasis
          teknologi dalam kehidupan sehari-hari untuk memudahkan dan
          meningkatkan efisiensi.
        </p>
        <p className="font-qs leading-8 text-white" data-aos="fade-up">
          Tantangan dalam mengerjakan proyek riset di bidang Teknologi Informasi
          dan Machine Learning sering kali kompleks, namun dengan semangat
          kolaborasi yang kuat di komunitas, kami selalu menemukan cara untuk
          mencapai solusi inovatif. Melalui pengalaman ini, saya belajar
          pentingnya kerja tim, adaptabilitas, dan tentunya, keberanian untuk
          terus mencoba dan belajar dari kesalahan.
        </p>
        <Socials />

        <Interest />
      </div>
    </section>
  );
};

export default About;

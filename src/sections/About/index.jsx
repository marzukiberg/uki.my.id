import React from 'react';
import InterestItem from './InterestItem';

const About = () => {
  return (
    <section>
      <div className="bg-blue-400 rounded-r-md p-6 md:px-28 md:py-12 inline-block space-y-6 md:w-4/5 relative">
        <div
          className="absolute bg-blue-400 bg-opacity-25 w-full h-full rounded-r-md left-0 top-4 md:left-4"
          data-aos="fade-in"
          style={{ zIndex: -1 }}
        ></div>
        <img
          src="/img/blob2.png"
          alt="Blob"
          className="absolute left-0 -top-6 md:top-0  "
        />
        <img
          src="/img/blob3.png"
          alt="Blob"
          className="absolute right-0 bottom-0"
        />
        <h2
          className="text-2xl md:text-3xl font-semibold text-white font-poppins text-center md:text-left"
          data-aos="slide-right"
        >
          About Me
        </h2>
        <p className="text-white leading-8 font-quicksand" data-aos="fade-up">
          Saya adalah seorang yang memiliki ketertarikan di dunia Teknologi
          Informasi, salah satunya dunia pengembangan software. Dalam waktu 1
          tahun saya sudah menguasai beberapa framework dalam pengembangan
          software mulai dari native hingga framework seperti ReactJS, NextJS,
          React Native, Codeigniter dan Laravel. Saya juga sudah menyelesaikan
          lebih dari 10 project permintaan Client Lokal. Namun bagi saya itu
          belum cukup, saya akan terus belajar hal baru karena bagi saya Ilmu
          merupakan Investasi yang sangat menguntungkan di kemudian hari.
        </p>
        <div className="space-y-2 text-white" data-aos="fade-up">
          <a href="#" className="space-x-2 block font-poppins">
            <i className="fa fa-envelope" aria-hidden="true"></i>
            <span>marzukiberg@gmail.com</span>
          </a>

          <div className="space-x-3 text-2xl">
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-telegram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        <div>
          <h4
            className="text-xl text-white font-semibold mb-3 font-poppins"
            data-aos="fade-up"
          >
            My Interests
          </h4>
          <div className="grid gap-3 md:grid-cols-3 max-w-xl font-quicksand">
            <InterestItem icon="fas fa-code" text="Programming" />
            <InterestItem icon="fas fa-book-open" text="Reading" />
            <InterestItem icon="fas fa-swatchbook" text="Learning" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

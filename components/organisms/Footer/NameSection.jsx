import React from 'react';

const NameSection = () => {
  return (
    <div className="container space-y-3 text-center md:text-left">
      <h2 className="text-white font-quicksand font-semibold text-2xl md:text-4xl">
        Marzuki
      </h2>
      <div className="text-lg space-x-3 text-white font-quicksand">
        <span>Frontend Web Developer</span> <span>|</span>{' '}
        <span>React Native Developer</span>
      </div>
      <div
        className="grid place-items-center text-white gap-6 md:gap-24 md:grid-cols-2"
        data-aos="fade-up"
      >
        <a href="#" className="space-x-2 block font-poppins order-last">
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
    </div>
  );
};

export default NameSection;

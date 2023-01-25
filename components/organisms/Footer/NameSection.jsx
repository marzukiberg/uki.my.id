import React from "react";

const NameSection = () => {
  return (
    <div className="container space-y-3 text-center md:text-left">
      <h2 className="font-qs text-2xl font-semibold text-white md:text-4xl">
        Marzuki
      </h2>
      <div className="font-qs space-x-3 text-lg text-white">
        <span>Frontend Web Developer</span> <span>|</span>{" "}
        <span>React Native Developer</span>
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-3 text-white md:flex-nowrap md:justify-between"
        data-aos="fade-up"
      >
        <a href="#" className="font-poppins order-last block space-x-2">
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

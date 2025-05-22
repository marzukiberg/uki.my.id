import React from "react";

const Socials = () => {
  return (
    <div className="space-y-2 text-white" data-aos="fade-up">
      <a href="#" className="font-poppins inline-flex items-center space-x-2">
        <i className="fa fa-envelope" aria-hidden="true"></i>
        <span>marzukiberg@gmail.com</span>
      </a>

      <div className="flex space-x-4 text-2xl">
        <a
          href="https://www.facebook.com/marzukiberg14"
          className="transition-colors hover:text-blue-200"
        >
          <i className="fab fa-facebook"></i>
        </a>
        <a
          href="https://www.instagram.com/ukay.fs"
          className="transition-colors hover:text-blue-200"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" className="transition-colors hover:text-blue-200">
          <i className="fab fa-telegram"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/marzukiberg/"
          className="transition-colors hover:text-blue-200"
        >
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  );
};

export default Socials;

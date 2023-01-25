import React from "react";

const Socials = () => {
  return (
    <div className="space-y-2 text-white" data-aos="fade-up">
      <a href="#" className="font-poppins block space-x-2">
        <i className="fa fa-envelope" aria-hidden="true"></i>
        <span>marzukiberg@gmail.com</span>
      </a>

      <div className="space-x-3 text-2xl">
        <a href="https://www.facebook.com/marzukiberg14">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://www.instagram.com/ukay.fs">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#">
          <i className="fab fa-telegram"></i>
        </a>
        <a href="https://www.linkedin.com/in/marzukiberg/">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  );
};

export default Socials;

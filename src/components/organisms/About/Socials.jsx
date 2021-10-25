import React from 'react';

const Socials = () => {
  return (
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
  );
};

export default Socials;

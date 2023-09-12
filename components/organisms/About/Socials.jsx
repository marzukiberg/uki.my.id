import React from "react";

const Socials = () => {
  return (
    <div className="space-y-2 text-white" data-aos="fade-up">
      <a href="#" className="font-poppins block space-x-2">
        <i className="fa fa-envelope" aria-hidden="true"></i>
        <span>umairahrizkyagurning@gmail.com</span>
      </a>

      <div className="space-x-3 text-2xl">
        <a href="https://www.facebook.com/umairah.rizkya">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://www.instagram.com/umairahrizkyagurning">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#">
          <i className="fab fa-telegram"></i>
        </a>
        <a href="https://www.linkedin.com/in/umairah-rizkya-gurning-17829b209/">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  );
};

export default Socials;

import Image from "next/image";
import PropTypes from "prop-types";
import React from "react";

const TechStackItem = ({ img, text }) => {
  return (
    <div
      className={
        "group relative flex overflow-hidden rounded-md border bg-white p-0 duration-300 hover:drop-shadow-xl"
      }
      data-aos="fade-up"
    >
      <div className="absolute -left-full top-0 z-[-1] h-full w-full bg-blue-400 duration-300 group-hover:left-0"></div>
      <div className="relative flex h-20 w-20 items-center justify-center bg-white p-2">
        <Image
          data-el={(e) => e.target.clientWidth}
          src={`/img/logos/${img}`}
          width={100}
          height={100}
          alt="logo"
        />
      </div>
      <div className="p-4">
        <h4 className="font-qs text-lg duration-300 group-hover:text-white md:text-xl">
          {text}
        </h4>
      </div>
    </div>
  );
};

TechStackItem.propTypes = {
  img: PropTypes.string,
  text: PropTypes.string,
};

export default TechStackItem;

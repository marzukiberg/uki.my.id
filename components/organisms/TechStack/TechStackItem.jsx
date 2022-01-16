import React from "react";
import PropTypes from "prop-types";
import styles from "./TechStack.module.css";
import Image from "next/image";
import { imgLoader } from "../../../utils/img-loader";

const TechStackItem = ({ img, text }) => {
  return (
    <div
      className={`flex items-center border space-x-3 rounded-md overflow-hidden group hover:drop-shadow-xl duration-300 ${styles.card}`}
      data-aos="fade-up"
    >
      <div className="w-20 h-20 p-2 relative">
        <Image
          layout="fill"
          objectFit="contain"
          loader={imgLoader}
          src={`/img/logos/${img}`}
          alt="logo"
        />
      </div>
      <div className="py-2">
        <h4 className="text-lg md:text-xl group-hover:text-white duration-300 font-quicksand">
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

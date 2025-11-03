import React from "react";
import PropTypes from "prop-types";
import styles from "./InterestItem.module.css";

const InterestItem = ({ icon, text }) => {
  return (
    <div
      className={`group container flex-grow rounded bg-white p-6 duration-300 hover:drop-shadow-xl ${styles.item}`}
      data-aos="fade-up"
    >
      <div className="text-xl text-blue-400">
        <i className={icon} aria-hidden="true"></i>
      </div>
      <span className="pointer-events-none text-lg duration-300 group-hover:text-blue-400">
        {text}
      </span>
    </div>
  );
};

InterestItem.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
};

export default InterestItem;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './InterestItem.module.css';

const InterestItem = ({ icon, text }) => {
  return (
    <div
      className={`flex-grow container rounded bg-white p-6 hover:drop-shadow-xl duration-300 group ${styles.item}`}
      data-aos="fade-up"
    >
      <div className="text-blue-400 text-xl">
        <i className={icon} aria-hidden="true"></i>
      </div>
      <span className="text-lg group-hover:text-blue-400 duration-300 pointer-events-none">
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

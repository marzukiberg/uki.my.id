import React from 'react';
import PropTypes from 'prop-types';
import styles from './TechStack.module.css';

const TechStackItem = ({ img, text }) => {
  return (
    <div
      className={`flex items-center border space-x-3 rounded-md overflow-hidden group hover:drop-shadow-xl duration-300 ${styles.card}`}
      data-aos="fade-up"
    >
      <div className="w-1/3 p-2">
        <img src={`/img/logos/${img}`} alt="logo" />
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

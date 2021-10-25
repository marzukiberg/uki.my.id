import React from 'react';
import PropTypes from 'prop-types';

const PoweredByItem = ({ logo, text }) => {
  return (
    <div className="text-center">
      <img
        src={`/img/logos/${logo}`}
        alt="ReactJS"
        className="w-16 h-16 object-contain mb-3 block mx-auto rounded-md"
      />

      <p className="text-sm font-quicksand text-gray-700">{text}</p>
    </div>
  );
};
PoweredByItem.propTypes = {
  logo: PropTypes.string,
  text: PropTypes.string,
};
export default PoweredByItem;

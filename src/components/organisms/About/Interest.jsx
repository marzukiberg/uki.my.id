import React from 'react';
import InterestItem from './InterestItem';

const Interest = () => {
  return (
    <div>
      <h4
        className="text-xl text-white font-semibold mb-3 font-poppins"
        data-aos="fade-up"
      >
        My Interests
      </h4>
      <div className="grid gap-3 md:grid-cols-3 max-w-xl font-quicksand">
        <InterestItem icon="fas fa-code" text="Programming" />
        <InterestItem icon="fas fa-book-open" text="Reading" />
        <InterestItem icon="fas fa-swatchbook" text="Learning" />
      </div>
    </div>
  );
};

export default Interest;

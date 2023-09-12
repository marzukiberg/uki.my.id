import React from "react";
import InterestItem from "./InterestItem";

const Interest = () => {
  return (
    <div>
      <h4
        className="font-poppins mb-3 text-xl font-semibold text-white"
        data-aos="fade-up"
      >
        My Interests
      </h4>
      <div className="font-qs grid max-w-xl gap-3 md:grid-cols-3">
        {/* <InterestItem icon="fas fa-code" text="Programming" />
        <InterestItem icon="fas fa-book-open" text="Reading" />
        <InterestItem icon="fas fa-swatchbook" text="Learning" /> */}
        <InterestItem icon="fas fa-book-open" text="Reading" />
        <InterestItem icon="fas fa-search" text="Doing Research" />
        <InterestItem icon="fas fa-database" text="Data Scientist" />
        <InterestItem icon="fas fa-code" text="Programming" />
      </div>
    </div>
  );
};

export default Interest;

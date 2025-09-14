import React from "react";
import FadeIn from "../../atoms/FadeIn";
import InterestItem from "./InterestItem";

const Interest = () => {
  return (
    <FadeIn>
      <div>
        <h4 className="font-poppins mb-3 text-xl font-semibold text-white">
          My Interests
        </h4>
        <div className="font-qs grid max-w-xl gap-3 md:grid-cols-3">
          <InterestItem icon="fas fa-code" text="Programming" />
          <InterestItem icon="fas fa-book-open" text="Reading" />
          <InterestItem icon="fas fa-swatchbook" text="Learning" />
        </div>
      </div>
    </FadeIn>
  );
};

export default Interest;

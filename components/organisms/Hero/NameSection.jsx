import { forwardRef } from "react";
import TypingText from "../../atoms/TypingText";

const NameSection = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="inline-block max-w-2xl rounded-xl bg-white/50 backdrop-blur-sm md:p-8"
    >
      <p className="font-poppins text-3xl">Hello, I am</p>
      <h2 className="font-poppins text-6xl font-semibold tracking-widest md:text-6xl">
        <TypingText
          text="Marzuki"
          speed={150}
          coloredText="uki"
          className="font-poppins"
        />
      </h2>
      <p className="font-poppins space-x-3 text-lg text-gray-500">
        <TypingText
          text="Frontend Web Developer | React Native Developer"
          speed={50}
          className="font-poppins"
          delay={200 * "Marzuki".length}
        />
      </p>
    </div>
  );
});

NameSection.displayName = "NameSection";
export default NameSection;

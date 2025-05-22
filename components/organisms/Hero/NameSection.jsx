import { forwardRef } from "react";

const NameSection = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="inline-block max-w-2xl rounded-xl bg-white/50 backdrop-blur-sm md:p-8"
    >
      <p className="font-poppins text-3xl">Hello, I am</p>
      <h2 className="font-poppins text-6xl font-semibold tracking-widest md:text-6xl">
        Marz<span className="text-blue-400">uki</span>
      </h2>
      <p className="font-poppins space-x-3 text-lg text-gray-500">
        <span>Frontend Web Developer</span> <span>|</span>{" "}
        <span>React Native Developer</span>
      </p>
    </div>
  );
});

NameSection.displayName = "NameSection";
export default NameSection;

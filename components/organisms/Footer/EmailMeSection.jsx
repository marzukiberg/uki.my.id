import React, { useRef } from "react";

const EmailMeSection = () => {
  const messageRef = useRef({});
  return (
    <div className="container" data-aos="slide-left">
      <h4 className="font-qs text-lg font-semibold text-white">Email Me</h4>
      <div className="flex space-x-2">
        <div className="relative flex w-full items-center overflow-hidden rounded-md bg-white focus-within:drop-shadow-xl">
          <div className="p-3 text-xl text-gray-300">
            <i className="fa fa-envelope" aria-hidden="true"></i>
          </div>
          <input
            type="text"
            className="font-qs w-full py-3 focus:outline-none"
            placeholder="Your message..."
            ref={messageRef}
          />
        </div>
        <a
          href={`mailto:umairahrizkya@gmail.com?subject=Would like to hiring&body=${messageRef.current.value}`}
          target={"_blank"}
          className="font-qs rounded-md bg-blue-500  px-6 py-3 text-white duration-300 hover:bg-blue-800 hover:shadow-xl focus:ring"
          rel="noreferrer"
        >
          <span className="hidden md:inline">Submit</span>
          <span className="md:hidden">
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </span>
        </a>
      </div>
    </div>
  );
};

export default EmailMeSection;

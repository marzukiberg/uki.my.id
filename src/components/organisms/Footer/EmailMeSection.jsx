import React from "react";

const EmailMeSection = () => {
  return (
    <div className="container" data-aos="slide-left">
      <h4 className="text-lg text-white font-semibold font-quicksand">
        Email Me
      </h4>
      <div className="flex space-x-2">
        <div className="relative bg-white w-full rounded-md overflow-hidden focus-within:drop-shadow-xl flex items-center">
          <div className="text-xl p-3 text-gray-300">
            <i className="fa fa-envelope" aria-hidden="true"></i>
          </div>
          <input
            type="text"
            className="py-3 focus:outline-none w-full font-quicksand"
            placeholder="Your message..."
          />
        </div>
        <button className="px-6 py-3 rounded-md  bg-blue-600 text-white font-quicksand hover:bg-blue-800 hover:shadow-xl focus:ring duration-300">
          <span className="hidden md:inline">Submit</span>
          <span className="md:hidden">
            <i className="fa fa-paper-plane" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default EmailMeSection;

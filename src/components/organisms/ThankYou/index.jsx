import React from 'react';

const ThankYou = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2">
          <div className="container" data-aos="fade-up">
            <img
              src="/img/profile.jpeg"
              alt="Profile Picture"
              className="w-80 h-80 block ml-auto rounded-full object-cover"
            />
          </div>
          <div className="flex items-center">
            <div className="container space-y-6 text-center md:text-left">
              <h2
                className="text-2xl md:text-4xl font-semibold font-poppins mb-6"
                data-aos="slide-left"
              >
                Thank you for visit!
              </h2>
              <p className="leading-8 font-quicksand" data-aos="fade-up">
                Contact me if you need a further information about me and my
                services.
              </p>
              <a href="#" className="inline-block" data-aos="fade-up">
                <button className="px-6 py-3 rounded-md bg-blue-400 text-white font-poppins hover:shadow-xl focus:ring duration-300 space-x-3">
                  <span>Hire Me</span>
                  <i className="fa fa-star" aria-hidden="true"></i>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <img
        src="/img/blob6.png"
        alt="Blob6"
        className="absolute z-[-1] right-0 -top-1/2 transform translate-y-[-32px]"
      />
    </section>
  );
};

export default ThankYou;

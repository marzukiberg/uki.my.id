import Image from "next/image";
import React from "react";

const ThankYou = () => {
  return (
    <section id="thankyou" className="py-16 sm:py-24">
      <div className="container relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="absolute bottom-0 right-0 z-[-1] h-1/2 w-full max-w-md transform overflow-hidden sm:h-full sm:max-w-[640px] sm:translate-x-1/2">
          <Image
            src="/img/blob6.png"
            alt="Blob6"
            fill
            className="h-auto w-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center">
          <Image
            loading="lazy"
            src="/img/profile.jpeg"
            alt="Profile Picture"
            width={250}
            height={250}
            className="m-3 h-48 w-48 rounded-full object-cover md:m-0 md:h-64 md:w-64"
          />
          <div className="space-y-6 text-center md:text-left">
            <h2
              className="font-poppins mb-4 text-2xl font-semibold sm:text-3xl md:text-4xl"
              // data-aos="slide-left"
            >
              Thank you for visit!
            </h2>
            <p
              className="font-qs max-w-2xl leading-relaxed text-gray-700"
              // data-aos="fade-up"
            >
              Please feel free to contact me if you need any further information
              about me and the services I offer. I would be happy to provide
              additional details and answer any questions you may have. Thank
              you for your interest in my work.
            </p>
            <a
              href="#"
              className="font-poppins inline-block rounded-md bg-blue-400 px-6 py-3 text-white duration-300 hover:shadow-xl focus:ring sm:space-x-3"
              // data-aos="fade-up"
            >
              <span>Hire Me</span>
              <i className="fa fa-star" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThankYou;

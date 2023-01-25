import Image from "next/image";
import React from "react";

const ThankYou = () => {
  return (
    <section id="thankyou">
      <div className="container relative mx-auto max-w-5xl p-8 lg:p-16">
        <div className="absolute right-0 bottom-0 z-[-1] h-full w-[640px] transform">
          <Image src="/img/blob6.png" alt="Blob6" width={1000} height={1000} />
        </div>
        <div className="flex flex-wrap items-center gap-6 md:flex-nowrap">
          <Image
            loading="lazy"
            src="/img/profile.jpeg"
            alt="Profile Picture"
            width={300}
            height={300}
            className="m-3 mx-auto h-[80%] w-[80%] rounded-full md:w-[40%]"
          />
          <div className="container space-y-6 text-center md:text-left">
            <h2
              className="font-poppins mb-6 text-2xl font-semibold md:text-4xl"
              // data-aos="slide-left"
            >
              Thank you for visit!
            </h2>
            <p
              className="font-qs leading-8"
              // data-aos="fade-up"
            >
              Please feel free to contact me if you need any further information
              about me and the services I offer. I would be happy to provide
              additional details and answer any questions you may have. Thank
              you for your interest in my work.
            </p>
            <a
              href="#"
              className="font-poppins inline-block space-x-3 rounded-md bg-blue-400 px-6 py-3 text-white duration-300 hover:shadow-xl focus:ring"
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

import Image from "next/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const ThankYou = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <div className="mx-auto max-w-6xl grid gap-12 md:grid-cols-2">
          <div className="container" data-aos="fade-up">
            <div className="w-72 h-72 overflow-hidden rounded-full">
              <Image
                loading="lazy"
                layout="fill"
                objectFit="contain"
                objectPosition={"right"}
                src="/img/profile.jpeg"
                loader={imgLoader}
                alt="Profile Picture"
              />
            </div>
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

      <div className="absolute z-[-1] right-0 bottom-0 transform translate-y-[100px] w-[640px] h-full">
        <Image
          src="/img/blob6.png"
          loader={imgLoader}
          alt="Blob6"
          layout="fill"
          objectFit="cover"
        />
      </div>
    </section>
  );
};

export default ThankYou;

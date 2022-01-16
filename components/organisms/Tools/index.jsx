import Image from "next/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const Tools = () => {
  return (
    <section id="tools" className="relative">
      <div className="absolute w-64 h-64 left-[10%] -bottom-24 transform rotate-45 opacity-20">
        <Image
          layout="fill"
          objectFit="contain"
          src="/img/logos/reactjs-hd.png"
          loader={imgLoader}
          alt="ReactJS"
        />
      </div>

      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <h2
          className="text-2xl md:text-4xl font-semibold font-poppins mb-6 text-center"
          data-aos="fade-in"
        >
          Tools
        </h2>
        <div className="flex flex-wrap gap-12 justify-center">
          <div className="w-16 h-16 relative">
            <Image
              layout="fill"
              objectFit="contain"
              src="/img/logos/visual-studio-code.png"
              loader={imgLoader}
              alt="VS Code"
              data-aos="fade-up"
            />
          </div>

          <div className="w-32 relative">
            <Image
              layout="fill"
              objectFit="contain"
              src="/img/logos/npm.svg"
              loader={imgLoader}
              alt="NPM"
              data-aos="fade-up"
            />
          </div>

          <div className="w-16 h-16 relative">
            <Image
              layout="fill"
              objectFit="contain"
              src="/img/logos/github.png"
              loader={imgLoader}
              alt="Github"
              data-aos="fade-up"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tools;

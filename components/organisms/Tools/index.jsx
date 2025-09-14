import Image from "next/legacy/image";
import { imgLoader } from "../../../utils/img-loader";

const Tools = () => {
  return (
    <section id="tools" className="relative py-16 sm:py-24">
      <div className="absolute -bottom-24 left-[10%] hidden h-64 w-64 rotate-45 transform opacity-20 sm:block">
        <Image
          layout="fill"
          objectFit="contain"
          src="/img/logos/reactjs-hd.png"
          loader={imgLoader}
          alt="ReactJS"
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="font-poppins mb-6 text-center text-2xl font-semibold sm:text-3xl md:text-4xl"
          data-aos="fade-in"
        >
          Tools
        </h2>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12">
          <div className="relative h-12 w-12 sm:h-16 sm:w-16">
            <Image
              layout="fill"
              objectFit="contain"
              src="/img/logos/visual-studio-code.png"
              loader={imgLoader}
              alt="VS Code"
              data-aos="fade-up"
            />
          </div>

          <div className="relative h-12 w-24 sm:h-16 sm:w-32">
            <Image
              layout="fill"
              objectFit="contain"
              src="/img/logos/npm.svg"
              loader={imgLoader}
              alt="NPM"
              data-aos="fade-up"
            />
          </div>

          <div className="relative h-12 w-12 sm:h-16 sm:w-16">
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

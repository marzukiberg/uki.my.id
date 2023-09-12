import Image from "next/legacy/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const Tools = () => {
  return (
    <section id="tools" className="relative">
      <div className="container mx-auto max-w-7xl p-8 lg:p-16">
        <h2
          className="font-poppins mb-6 text-center text-2xl font-semibold md:text-4xl"
          data-aos="fade-in"
        >
          Tools
        </h2>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="relative h-16 w-16">
            <Image
              layout="fill"
              objectFit="contain"
              src="https://img.icons8.com/color/48/tensorflow.png"
              loader={imgLoader}
              alt="Tensorflow"
              data-aos="fade-up"
            />
            <div className="absolute -bottom-12 left-0 text-center text-xs text-gray-700">
              <a href="https://icons8.com/icon/n3QRpDA7KZ7P/tensorflow">
                Tensorflow
              </a>{" "}
              icon by <a href="https://icons8.com">Icons8</a>
            </div>
          </div>

          <div className="relative w-32">
            <Image
              layout="fill"
              objectFit="contain"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Keras_logo.svg/240px-Keras_logo.svg.png"
              loader={imgLoader}
              alt="Keras"
              data-aos="fade-up"
            />
            <div className="absolute -bottom-8 left-1/2 translate-x-[-50%] transform text-center text-xs text-gray-700">
              icon by <a href="https://wikipedia.com">Wikipedia</a>
            </div>
          </div>

          <div className="relative h-16 w-16">
            <Image
              layout="fill"
              objectFit="contain"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Pandas_logo.svg/320px-Pandas_logo.svg.png"
              loader={imgLoader}
              alt="Pandas"
              data-aos="fade-up"
            />
            <div className="absolute -bottom-8 left-1/2 translate-x-[-50%] transform text-center text-xs text-gray-700">
              icon by <a href="https://wikipedia.com">Wikipedia</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tools;

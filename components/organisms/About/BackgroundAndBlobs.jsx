import Image from "next/legacy/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const BackgroundAndBlobs = () => {
  return (
    <>
      <div
        className="absolute left-0 top-4 z-[-1] h-full w-full rounded-r-md bg-blue-400 bg-opacity-25 md:left-4"
        data-aos="fade-in"
      ></div>
      <div className="absolute -top-6 left-0 h-full w-48">
        <Image
          layout="fill"
          objectFit="cover"
          src="/img/blob2.png"
          loader={imgLoader}
          alt="Blob"
        />
      </div>
      <div className="absolute bottom-0 right-0 h-full w-96">
        <Image
          layout="fill"
          objectFit="contain"
          src="/img/blob3.png"
          loader={imgLoader}
          alt="Blob"
        />
      </div>
    </>
  );
};

export default BackgroundAndBlobs;

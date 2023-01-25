import Image from "next/legacy/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const BackgroundAndBlobs = () => {
  return (
    <>
      <div
        className="absolute bg-blue-400 bg-opacity-25 w-full h-full rounded-r-md left-0 top-4 md:left-4 z-[-1]"
        data-aos="fade-in"
      ></div>
      <div className="absolute left-0 -top-6 w-48 h-full">
        <Image
          layout="fill"
          objectFit="cover"
          src="/img/blob2.png"
          loader={imgLoader}
          alt="Blob"
        />
      </div>
      <div className="absolute right-0 bottom-0 w-96 h-full">
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

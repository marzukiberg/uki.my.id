import Image from "next/legacy/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const BackgroundImages = () => {
  return (
    <>
      <div className="absolute left-1/2 bottom-0 h-64 w-64 translate-x-[-50%] transform">
        <Image
          layout="fill"
          loader={imgLoader}
          className="rounded-full"
          src="/img/umai.jpeg"
          alt="Profile Picture Umairah"
          objectFit="contain"
        />
      </div>
    </>
  );
};

export default BackgroundImages;

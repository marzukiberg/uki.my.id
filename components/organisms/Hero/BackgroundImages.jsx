import Image from "next/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const BackgroundImages = () => {
  return (
    <>
      <div className="w-full h-screen relative">
        <Image
          layout="fill"
          objectFit="contain"
          loader={imgLoader}
          src="/img/logos.png"
          alt="Logos"
        />
      </div>

      <div className="w-[300px] h-[300px] absolute left-1/2 bottom-0 transform translate-x-[-50%]">
        <Image
          layout="fill"
          loader={imgLoader}
          src="/img/profile.jpeg"
          alt="Profile Picture"
          objectFit="contain"
        />
      </div>
    </>
  );
};

export default BackgroundImages;

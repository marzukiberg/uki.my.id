import Image from "next/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const Blobs = () => {
  return (
    <>
      <div className="absolute left-0 top-0 z-[-1] w-96 h-96">
        <Image
          layout="fill"
          objectFit="cover"
          loader={imgLoader}
          src="/img/blob1.png"
          alt="Blob"
        />
      </div>
      <div className="absolute right-0 bottom-0 z-[-1] w-64 h-full">
        <Image
          layout="fill"
          objectFit="cover"
          loader={imgLoader}
          src="/img/blob4.png"
          alt="Blob"
        />
      </div>
    </>
  );
};

export default Blobs;

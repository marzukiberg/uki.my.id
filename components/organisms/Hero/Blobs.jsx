import Image from "next/legacy/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const Blobs = () => {
  return (
    <>
      <div className="absolute left-0 top-0 z-[-1] h-96 w-96">
        <Image
          layout="fill"
          objectFit="cover"
          loader={imgLoader}
          src="/img/blob1.png"
          alt="Blob"
        />
      </div>
      <div className="absolute bottom-0 right-0 z-[-1] h-full w-64">
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

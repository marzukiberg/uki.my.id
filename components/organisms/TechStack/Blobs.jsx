import Image from "next/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const Blobs = () => {
  return (
    <div className="absolute left-0 bottom-0 h-full transform translate-y-24 z-[-1] w-[400px] h-full">
      <Image
        layout="fill"
        src="/img/blob5.png"
        loader={imgLoader}
        alt="Overlay"
        objectFit="contain"
        objectPosition={"left"}
      />
    </div>
  );
};

export default Blobs;

import Image from "next/legacy/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const PoweredByItem = ({ logo, text }) => {
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-3 block h-16 w-16 rounded-md object-contain">
        <Image
          layout="fill"
          objectFit="contain"
          loader={imgLoader}
          src={`/img/logos/${logo}`}
          alt={text}
        />
      </div>

      <p className="font-qs text-sm text-gray-700">{text}</p>
    </div>
  );
};
export default PoweredByItem;

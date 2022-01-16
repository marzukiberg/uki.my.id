import Image from "next/image";
import React from "react";
import { imgLoader } from "../../../utils/img-loader";

const PoweredByItem = ({ logo, text }) => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 object-contain mb-3 block mx-auto rounded-md relative">
        <Image
          layout="fill"
          objectFit="contain"
          loader={imgLoader}
          src={`/img/logos/${logo}`}
          alt={text}
        />
      </div>

      <p className="text-sm font-quicksand text-gray-700">{text}</p>
    </div>
  );
};
export default PoweredByItem;

import Image from "next/legacy/image";
import { imgLoader } from "../../../utils/img-loader";

const Blobs = () => {
  return (
    <div className="absolute bottom-0 left-0 z-[-1] h-full w-[200px] translate-y-16 transform sm:w-[250px] sm:translate-y-20 md:w-[300px] md:translate-y-24 lg:w-[400px] lg:translate-y-32">
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

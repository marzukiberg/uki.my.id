import Image from "next/image";
import { imgLoader } from "../../../utils/img-loader";
import styles from "./PortfolioCard.module.css";

const PortfolioCard = ({ title, text, img, link, stacks }) => {
  return (
    <div
      className={`bg-white drop-shadow-lg rounded-lg overflow-hidden ${styles.card}`}
      data-aos="fade-up"
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="relative bg-gray-100">
            <div className="w-full h-64 relative">
              <Image
                src={"https://res.cloudinary.com/uki14/image/upload" + img}
                loader={imgLoader}
                alt={title}
                loading="lazy"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <a
              href="#"
              className="absolute right-0 top-0 w-12 h-12 bg-blue-400 bg-opacity-70 text-white rounded-bl-lg text-xl flex items-center justify-center hover:bg-opacity-100 duration-300"
            >
              <i className="fa fa-share-alt" aria-hidden="true"></i>
            </a>
          </div>
          <div className="p-6">
            <h4 className="text-lg md:text-xl font-semibold font-poppins">
              {title}
            </h4>
            <p className="leading-8 font-quicksand">{text}</p>
          </div>
        </div>
        <div className="px-6 pb-3">
          <div className="flex justify-between items-center border-t pt-3">
            <div className={`flex gap-2 flex-wrap`}>
              {stacks.map((stack, index) => (
                <div className="w-8 h-8 relative" key={`${index}`}>
                  <Image
                    src={`/img/logos/${stack}`}
                    loader={imgLoader}
                    alt={"Stack"}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              ))}
            </div>
            <div>
              <a
                href={link}
                target={link === "/#" ? null : `_blank`}
                className={`rounded-lg p-3 text-white space-x-3 inline-flex items-center ${
                  link === "/#"
                    ? "bg-gray-300 cursor-default"
                    : "bg-blue-400 hover:bg-blue-600 focus:ring focus:bg-blue-600"
                } duration-300`}
              >
                <span className="font-quicksand">Demo</span>
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;

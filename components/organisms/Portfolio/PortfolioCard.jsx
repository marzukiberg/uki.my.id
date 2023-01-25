import Image from "next/image";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const PortfolioCard = ({
  title,
  text,
  img,
  link,
  stacks,
  localImage = false,
}) => {
  const imgSrc = localImage
    ? `/img/portfolios/${img}`
    : `https://res.cloudinary.com/uki14/image/upload${img}`;
  return (
    <div
      className={
        "card group relative overflow-hidden rounded-lg bg-white drop-shadow-lg"
      }
      data-aos="fade-up"
    >
      {/* blob effects */}
      <div className="absolute -left-full -bottom-full z-[-1] h-64 w-64 rounded-full bg-blue-300 duration-300 group-hover:-bottom-32 group-hover:-left-32"></div>
      <div className="card-img relative h-64">
        <Image
          src={imgSrc}
          alt={title}
          className="absolute inset-0 z-[-1] m-0 h-full w-full object-cover blur"
          loading="lazy"
          width={100}
          height={100}
        />
        <Image
          src={imgSrc}
          alt={title}
          className="m-0 h-full w-full object-contain"
          loading="lazy"
          width={1000}
          height={1000}
        />
        <div className="absolute right-0 top-0">
          <a
            href="#"
            className="float-right flex h-12 w-12 items-center justify-center rounded-bl-lg bg-blue-400 bg-opacity-70 text-xl text-white duration-300 hover:bg-opacity-100"
          >
            <i className="fa fa-share-alt" aria-hidden="true"></i>
          </a>
        </div>
      </div>
      <div className="card-header px-6 py-3">
        <h4 className="font-poppins text-md font-semibold md:text-xl">
          {title}
        </h4>
      </div>
      <div className="card-body px-6">
        <p className="font-qs text-gray-700">{text}</p>
      </div>
      <div className="card-footer p-6">
        <div className="flex justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3 rounded bg-white bg-opacity-50 p-2">
            {stacks.map((stack, index) => (
              <Image
                src={`/img/logos/${stack}`}
                alt={"Stack"}
                width={100}
                height={100}
                className="h-8 w-8"
                key={index}
              />
            ))}
          </div>
          <div className="">
            <a
              href={link}
              target={link === "/#" ? null : `_blank`}
              className={`inline-flex items-center space-x-3 rounded-lg p-3 text-white ${
                link === "/#"
                  ? "cursor-default bg-gray-300"
                  : "bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 focus:ring"
              } duration-300`}
            >
              <span className="font-qs">Demo</span>
              <i className="fas fa-external-link-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

PortfolioCard.propTypes = {
  img: PropTypes.string,
  link: PropTypes.string,
  stacks: PropTypes.array,
  text: PropTypes.string,
  title: PropTypes.string,
};

export default PortfolioCard;

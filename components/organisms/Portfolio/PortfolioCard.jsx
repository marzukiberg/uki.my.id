import Image from "next/image";
import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react"; // Import useState
import gsap from "gsap";
import { getPortfolioImageUrl } from "../../../utils/imageUtils"; // Import helper

const PortfolioCard = ({
  title,
  text,
  img,
  link,
  stacks,
  localImage = false,
}) => {
  const modalRef = useRef(null);
  const imgContainerRef = useRef(null);
  const timeline = useRef(null);
  const placeholderImage = `https://placehold.co/400x300?text=Image+Not+Found`; // Define placeholder
  const [currentImageSrc, setCurrentImageSrc] = useState(
    getPortfolioImageUrl({ img, localImage })
  ); // Use state for image src

  // Handle image loading errors
  const handleError = () => {
    setCurrentImageSrc(placeholderImage);
  };

  useEffect(() => {
    // Set initial states
    gsap.set(modalRef.current, { display: "none", opacity: 0 });
    gsap.set(imgContainerRef.current, { scale: 0.5, opacity: 0 });

    // Create timeline
    timeline.current = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.inOut" },
    });

    timeline.current
      .to(modalRef.current, {
        display: "flex",
        opacity: 1,
        duration: 0.3,
      })
      .to(
        imgContainerRef.current,
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
        },
        "-=0.1"
      );

    return () => {
      timeline.current && timeline.current.kill();
    };
  }, []);

  const handleZoom = () => {
    if (!timeline.current) return;
    timeline.current.play();
  };

  const handleUnzoom = () => {
    if (!timeline.current) return;
    timeline.current.reverse();
  };

  return (
    <>
      <div
        className={
          "card group relative overflow-hidden rounded-lg bg-white drop-shadow-lg border-2 border-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
        }
        data-aos="fade-up"
      >
        {/* blob effects */}
        <div className="absolute -bottom-full -left-full z-[-1] h-64 w-64 rounded-full bg-blue-300 duration-300 group-hover:-bottom-32 group-hover:-left-32"></div>
        <div className="card-img relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="relative h-full">
            <Image
              src={currentImageSrc || placeholderImage} // Use state for src, fallback to placeholder
              alt={title}
              fill
              className="m-0 h-full w-full object-contain"
              loading="lazy"
              onError={handleError} // Use the state-updating handler
            />
            {/* Overlay with zoom button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-black opacity-30"></div>
              <button
                onClick={handleZoom}
                className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800"
              >
                <i className="fas fa-search-plus text-lg"></i>
              </button>
            </div>
          </div>
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
                className={`inline-flex items-center space-x-3 rounded-lg p-3 text-white ${link === "/#"
                  ? "cursor-default bg-gray-300"
                  : "bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 focus:ring"
                  } duration-300`}
              >
                <span className="font-qs">Visit</span>
                <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Modal */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[99999] items-center justify-center bg-black bg-opacity-50"
        onClick={handleUnzoom}
      >
        <button
          className="absolute right-4 top-4 text-2xl text-white"
          onClick={handleUnzoom}
        >
          <i className="fas fa-times"></i>
        </button>
        <div ref={imgContainerRef} className="relative h-[90vh] w-[90vw]">
          <Image
            src={currentImageSrc || placeholderImage} // Use state for src, fallback to placeholder
            alt={title}
            className="object-contain"
            fill
            priority
            onError={handleError} // Use the state-updating handler
          />
        </div>
      </div>
    </>
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

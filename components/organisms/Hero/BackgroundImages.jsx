import Image from "next/legacy/image";
import { imgLoader } from "../../../utils/img-loader";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import useScreen from "../../../hooks/useScreen";

const logos = [
  "/img/logos/reactjs.png",
  "/img/logos/git.png",
  "/img/logos/nextjs.png",
  "/img/logos/firebase.png",
  "/img/logos/github.png",
  "/img/logos/javascript.png",
  "/img/logos/mysql.png",
  "/img/logos/npm.svg",
  "/img/logos/redux.svg",
  "/img/logos/tailwindcss.svg",
  "/img/logos/vercel.png",
  "/img/logos/vuejs.png",
];

const calculatePosition = (
  index,
  position,
  windowWidth,
  windowHeight,
  isMobile,
  sectionHeight
) => {
  if (isMobile) {
    const containerHeight = sectionHeight || windowHeight;
    const bottomAreaStart = containerHeight * 0.7;
    const bottomAreaEnd = containerHeight - 40; // avoid mentok bawah
    const availableHeight = bottomAreaEnd - bottomAreaStart;
    const horizontalPadding = 40;

    return {
      position: "absolute",
      left: `${
        horizontalPadding +
        Math.random() * (windowWidth - horizontalPadding * 2)
      }px`,
      top: `${bottomAreaStart + Math.random() * (availableHeight - 40)}px`,
      transform: "translate(-50%, -50%) scale(0.45)",
    };
  }

  // Desktop pentagon calculation
  const radius = 150;
  const centerX = position === "left" ? windowWidth * 0.2 : windowWidth * 0.8;
  const centerY = 300; // Fixed value instead of window.innerHeight

  if (index === 5) {
    return {
      left: position === "left" ? "20%" : "80%",
      top: "50%",
      transform: "translate(-50%, -50%) scale(0.6)",
    };
  }

  const angle = index * 72 * (Math.PI / 180);
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translate(-50%, -50%) scale(0.6)",
  };
};

const BackgroundImages = ({ nameSectionHeight }) => {
  const { width: windowWidth, height: windowHeight, isMobile } = useScreen();
  const logosRef = useRef([]);

  useEffect(() => {
    if (windowWidth === 0 || isMobile) return;

    logosRef.current.forEach((logo, index) => {
      // Only apply animations for desktop
      gsap.to(logo, {
        x: `random(-20, 20)`,
        y: `random(-20, 20)`,
        duration: `random(2, 4)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, [windowWidth, isMobile]);

  return (
    <>
      <div className="relative h-full w-full">
        {!isMobile && (
          <>
            {/* Desktop layout only */}
            {logos.slice(0, 6).map((logo, index) => (
              <div
                key={`left-${index}`}
                ref={(el) => (logosRef.current[index] = el)}
                className="absolute h-[80px] w-[80px] md:h-[100px] md:w-[100px]"
                style={calculatePosition(
                  index,
                  "left",
                  windowWidth,
                  windowHeight,
                  isMobile,
                  nameSectionHeight
                )}
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  loader={imgLoader}
                  src={logo}
                  alt={`Logo ${index + 1}`}
                />
              </div>
            ))}
            {logos.slice(6, 12).map((logo, index) => (
              <div
                key={`right-${index}`}
                ref={(el) => (logosRef.current[index + 6] = el)}
                className="absolute h-[80px] w-[80px] md:h-[100px] md:w-[100px]"
                style={calculatePosition(
                  index,
                  "right",
                  windowWidth,
                  windowHeight,
                  isMobile,
                  nameSectionHeight
                )}
              >
                <Image
                  layout="fill"
                  objectFit="contain"
                  loader={imgLoader}
                  src={logo}
                  alt={`Logo ${index + 7}`}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {!isMobile && (
        <div className="absolute bottom-0 left-1/2 z-10 h-[250px] w-[250px] translate-x-[-50%] transform">
          <Image
            layout="fill"
            loader={imgLoader}
            src="/img/profile.jpeg"
            alt="Profile Picture"
            objectFit="contain"
          />
        </div>
      )}
    </>
  );
};

export default BackgroundImages;

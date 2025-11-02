import { useEffect, useRef } from "react";
import gsap from "gsap";

const FadeIn = ({ children, duration = 1 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: duration / 1000,
              ease: "power2.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [duration]);

  return <div ref={containerRef}>{children}</div>;
};

export default FadeIn;

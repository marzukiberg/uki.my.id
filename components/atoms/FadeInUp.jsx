import { useEffect, useRef } from "react";
import gsap from "gsap";

const FadeInUp = ({ children, duration = 1 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target.children,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration,
                stagger: 0.1,
                ease: "power2.out",
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [duration]);

  return <div ref={containerRef}>{children}</div>;
};

export default FadeInUp;

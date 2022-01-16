import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";

const WebTemplates = () => {
  const iFrame = useRef();
  const router = useRouter();
  const { web } = router.query;

  useEffect(() => {
    const webObject = {
      "sc-hospital": "https://uki.my.id/web-templates/sc-hospital/",
    };
    iFrame.current.src = webObject[web];
    disableRightClick();
  }, [web]);

  const disableRightClick = () => {
    window.addEventListener("contextmenu", (e) => e.preventDefault());
  };

  return (
    <div>
      <iframe
        ref={iFrame}
        frameBorder="0"
        className="w-screen h-screen"
      ></iframe>
    </div>
  );
};

export default WebTemplates;

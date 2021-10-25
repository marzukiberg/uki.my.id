import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const WebTemplates = () => {
  const iFrame = useRef();

  const { web } = useParams();
  const webObject = {
    'sc-hospital': 'https://uki.my.id/web-templates/sc-hospital/',
  };

  useEffect(() => {
    iFrame.current.src = webObject[web];
    disableRightClick();
  }, []);

  const disableRightClick = () => {
    window.addEventListener('contextmenu', (e) => e.preventDefault());
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

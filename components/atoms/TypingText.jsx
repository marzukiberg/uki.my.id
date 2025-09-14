import { useState, useEffect } from "react";

const TypingText = ({
  text,
  speed = 150,
  className = "",
  coloredText = "",
  color = "text-blue-400",
  delay = 0,
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let typingInterval;
    const timer = setTimeout(() => {
      let i = 0;
      typingInterval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.substring(0, i));
          i++;
        } else {
          clearInterval(typingInterval);
          onComplete?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [text, speed, delay, onComplete]);

  if (!coloredText) {
    return <span className={className}>{displayText}</span>;
  }

  const coloredIndex = text.indexOf(coloredText);
  if (coloredIndex === -1) {
    return <span className={className}>{displayText}</span>;
  }

  return (
    <span className={className}>
      {displayText.substring(0, coloredIndex)}
      <span className={color}>{displayText.substring(coloredIndex)}</span>
    </span>
  );
};

export default TypingText;

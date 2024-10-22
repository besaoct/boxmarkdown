import React, { useRef } from 'react';

const HoverVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.loop = true;
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.loop = false;
    }
  };

  return (
    <div className="p-4 w-full mt-24  " >
      <video
        ref={videoRef}
        src="/hero-vid.mp4"
        className="z-50 border w-full shadow-inner border-background dark:border-foreground  invert-0 dark:invert max-w-5xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        muted // Ensures autoplay works without user interaction in some browsers
        controls={false}
      ></video>
    </div>
  );
};

export default HoverVideo;

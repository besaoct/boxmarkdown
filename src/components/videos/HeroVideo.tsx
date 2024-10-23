import React, { useRef, useState } from 'react';

const HoverVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track if video is playing

  const handleMouseEnter = () => {
    if (isVideoReady && videoRef.current) {
      videoRef.current.play();
      videoRef.current.loop = true;
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.loop = false;
    }
    setIsHovering(false);
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = () => {
    if (isVideoReady && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        videoRef.current.loop = true;
        setIsPlaying(true);
      }
    }
  };

  // Triggered when video is ready to be played
  const handleCanPlay = () => {
    setIsVideoReady(true);
  };

  return (
    <div className="p-4 w-full mt-24 max-w-full lg:max-w-4xl relative">
      {/* Image that shows until the video is loaded */}
      <img
        src="/hero.png"  // Replace with your placeholder image path
        alt="Video placeholder"
        className={`absolute dark:hidden inset-0 w-full h-full p-4 lg:max-w-4xl z-10 transition-opacity duration-500 ${(isHovering && isVideoReady) ? 'opacity-0' : 'opacity-100'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      />

      <img
        src="/hero-white.png"  // Replace with your placeholder image path
        alt="Video placeholder"
        className={`absolute hidden dark:block inset-0 w-full h-full p-4 lg:max-w-4xl z-10 transition-opacity duration-500 ${(isHovering && isVideoReady) ? 'opacity-0' : 'opacity-100'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
      />

      {/* Video that plays only on hover if it's loaded */}
      <video
        ref={videoRef}
        // src="/hero-vid.mp4"
        preload='auto'
        className={`w-full h-auto dark:invert transition-opacity duration-500 ${(isHovering && isVideoReady) ? 'opacity-100 z-20' : 'opacity-100'}`}
        onCanPlay={handleCanPlay} 
        muted
        controls={false}
        
      >

<source src="/hero-vid.mp4" type="video/mp4"  onCanPlay={handleCanPlay}  // Set the video as ready when it can play
       />
      </video>
    </div>
  );
};

export default HoverVideo;

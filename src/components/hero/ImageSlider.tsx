'use client';

import { useState, useEffect } from 'react';

const ImageSliderHero = () => {
  const images = [
    '/hero/hero-3.png',
    '/hero/hero-4.png',
    '/hero/hero-5.png',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Automatic slide change every 2 seconds when hovered
  useEffect(() => {
    let interval:any;
    if (isHovered) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 2000); // Change image every 2 seconds
    }

    return () => clearInterval(interval); // Cleanup on unmount or when hover state changes
  }, [isHovered, images.length]);

  return (
    <div
      className="relative max-w-4xl mx-auto mt-8 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}  // Start slide when hover
      onMouseLeave={() => setIsHovered(false)} // Stop slide when mouse leaves
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
           // eslint-disable-next-line @next/next/no-img-element 
          <img key={index} src={image} alt={`Slide ${index}`} className="w-full h-auto dark:invert" />
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ImageSliderHero;

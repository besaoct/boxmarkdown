// components/WaveDivider.tsx

import React from 'react';

interface WaveDividerProps {
  height?: number;
  flip?: boolean;
  colorFlip?: boolean;
}

const WaveDivider: React.FC<WaveDividerProps> = ({
  colorFlip=false,
  height = 100,
  flip = false,
}) => {
  return (
    <div   className={!colorFlip? "dark:bg-neutral-900": "bg-muted"} style={{ height: `${height}px`, overflow: 'hidden', width: '100%' }}>
      <svg
        viewBox="0 0 1440 100"
        className={ colorFlip? "dark:fill-neutral-900": "fill-muted"}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', transform: flip ? 'scaleY(-1)' : 'none' }}
      >
        <path
          d="M0,0 C240,100 480,100 720,50 C960,0 1200,0 1440,100 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;

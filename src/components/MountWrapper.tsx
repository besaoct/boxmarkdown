'use client'

import React, { useState, useEffect } from 'react';

interface MountWrapperProps {
  children: React.ReactNode;
}

const MountWrapper: React.FC<MountWrapperProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Do not render the children until mounted
  }

  return <>{children}</>;
};

export default MountWrapper;

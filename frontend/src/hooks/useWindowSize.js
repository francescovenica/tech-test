import { useState, useEffect } from 'react';

const getSizes = window => ({
  width: window.innerWidth,
  height: window.innerHeight,
  isPadLand: window.innerWidth <= 1024,
  isPadPort: window.innerWidth <= 768,
  isMobile: window.innerWidth < 768,
});

export default () => {
  const isWindowClient = typeof window === 'object';

  const [windowSize, setWindowSize] = useState(
    isWindowClient ? getSizes(window) : {},
  );

  useEffect(() => {
    const setSize = () => setWindowSize(getSizes(window));

    if (isWindowClient) {
      window.addEventListener('resize', setSize);

      return () => window.removeEventListener('resize', setSize);
    }
  }, [isWindowClient]);

  return windowSize;
};

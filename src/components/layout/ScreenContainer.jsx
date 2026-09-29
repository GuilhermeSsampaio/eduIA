import { useState, useEffect } from 'react';
import './ScreenContainer.css';

export const ScreenContainer = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  return (
    <div className={`screen-container ${show ? 'fade-enter-active' : 'fade-enter'}`}>
      {children}
    </div>
  );
};

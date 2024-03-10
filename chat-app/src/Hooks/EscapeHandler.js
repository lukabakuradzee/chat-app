import { useEffect } from 'react';

const useEscapeKeyHandler = (callback) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
};

export default useEscapeKeyHandler;
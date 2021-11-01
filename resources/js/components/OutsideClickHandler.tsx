import React, {createRef, useEffect} from 'react';

interface Props {
  children: any;
  onOutsideClick: () => void;
}

export default function OutsideClickHandler({children, onOutsideClick}: Props) {
  const wrapperRef = createRef<HTMLDivElement>();

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleClick = (event: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      return onOutsideClick();
    }
  };
  return <div ref={wrapperRef}>{children}</div>;
}

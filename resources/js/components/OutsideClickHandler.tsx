import React, {createRef, useEffect} from 'react';

interface Props {
  children: React.ReactNode;
  onOutsideClick: () => void;
}

export default function OutsideClickHandler({children, onOutsideClick}: Props) {
  const wrapperRef = createRef<HTMLDivElement>();

  const handleClick = (event: any) => {
    const button = event.target as HTMLInputElement;
    if (wrapperRef.current && !wrapperRef.current.contains(button)) {
      return onOutsideClick();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  });

  return <div ref={wrapperRef}>{children}</div>;
}

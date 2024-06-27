import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface PopupProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Popup: React.FC<PopupProps> = ({ children, isOpen,setIsOpen }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as HTMLElement)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50">
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-md"
            ref={popupRef}
          >
            <div className="flex justify-end">
              {/* Close button container */}
              <Button variant="outline" size="sm" onClick={handleClose}>
                X
              </Button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;

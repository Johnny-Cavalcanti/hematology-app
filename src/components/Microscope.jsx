import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Loader from './Loader';
import useMicroscope from '../hooks/useMicroscope';

const Microscope = forwardRef(({ activeDeck }, ref) => {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    zoomLevel,
    translate,
    resetView,
    zoomIn,
    zoomOut,
  } = useMicroscope(viewportRef, contentRef, activeDeck);

  useEffect(() => {
    if (activeDeck) {
      setIsLoading(true);
      const imagePromises = activeDeck.srcs.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      Promise.all(imagePromises).then(() => {
        setIsLoading(false);
      });
    }
  }, [activeDeck]);

  useImperativeHandle(ref, () => ({
    zoomIn,
    zoomOut,
    resetView,
  }));

  return (
    <div
      ref={viewportRef}
      className="relative w-full h-full max-w-[90vh] max-h-[90vw] aspect-square bg-black rounded-full overflow-hidden border-8 border-slate-700 shadow-2xl cursor-grab"
    >
      <div
        ref={contentRef}
        className="absolute pointer-events-none"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
          display: 'flex',
          width: activeDeck ? `${4000 * activeDeck.srcs.length}px` : 'auto',
          height: '3000px',
        }}
      >
        {activeDeck && activeDeck.srcs.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className="h-full w-auto"
            draggable="false"
          />
        ))}
      </div>

      {isLoading && <Loader />}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/50 px-4 py-2 rounded-md">
        <span className="text-lg font-medium">Zoom: {zoomLevel.toFixed(1)}x</span>
      </div>
    </div>
  );
});

export default Microscope;
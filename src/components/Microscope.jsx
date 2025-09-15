import { useRef, useEffect } from "react";

export default function Microscope({ images, zoomLevel, translate, onDrag, onWheel, onStartDrag, onEndDrag }) {
  const viewportRef = useRef(null);
  const movableRef = useRef(null);

  // Atualiza o conteúdo quando imagens mudam
  useEffect(() => {
    if (movableRef.current) {
      movableRef.current.innerHTML = images
        .map((src, idx) => `<img src="${src}" class="h-full w-auto" alt="Parte ${idx + 1}" draggable="false"/>`)
        .join("");
    }
  }, [images]);

  return (
    <div
      id="microscope-viewport"
      ref={viewportRef}
      className="relative w-11/12 md:w-[700px] aspect-square bg-black rounded-full overflow-hidden border-8 border-gray-700 shadow-2xl cursor-grab"
      onMouseDown={(e) => onStartDrag(e.clientX, e.clientY)}
      onMouseMove={(e) => onDrag(e.clientX, e.clientY)}
      onMouseUp={onEndDrag}
      onMouseLeave={onEndDrag}
      onWheel={onWheel}
      onTouchStart={(e) => {
        if (e.touches.length > 0) onStartDrag(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchMove={(e) => {
        if (e.touches.length > 0) onDrag(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={onEndDrag}
    >
      <div
        ref={movableRef}
        id="movable-content"
        className="absolute pointer-events-none flex"
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoomLevel})`,
          transformOrigin: "0 0",
          height: "3000px",
        }}
      ></div>
    </div>
  );
}

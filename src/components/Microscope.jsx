import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Loader from './Loader';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 20.0;
const FRICTION = 0.95;

const Microscope = forwardRef(({ activeDeck }, ref) => {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);

  // Usamos 'ref' para guardar valores que mudam mas não precisam re-renderizar o componente.
  const state = useRef({
    isDragging: false,
    translate: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    lastTouch: { x: 0, y: 0 },
    animationFrameId: null,
  }).current;

  // Função para atualizar a posição e escala da imagem
  const updateTransform = () => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${state.translate.x}px, ${state.translate.y}px) scale(${zoomLevel})`;
    }
  };

  // Função para garantir que a imagem não saia dos limites do visor
  const clampPosition = () => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content || !content.offsetWidth) return;

    const viewportRect = viewport.getBoundingClientRect();
    const scaledWidth = content.offsetWidth * zoomLevel;
    const scaledHeight = content.offsetHeight * zoomLevel;

    state.translate.x = Math.max(viewportRect.width - scaledWidth, Math.min(0, state.translate.x));
    state.translate.y = Math.max(viewportRect.height - scaledHeight, Math.min(0, state.translate.y));
  };
  
  // Efeito que carrega as imagens quando a 'activeDeck' muda
  useEffect(() => {
    if (!activeDeck || !contentRef.current) return;
    
    setIsLoading(true);
    const content = contentRef.current;
    content.innerHTML = ''; // Limpa imagens antigas
    content.style.width = `${4000 * activeDeck.srcs.length}px`;
    content.style.height = '3000px';
    content.style.display = 'flex';

    const imagePromises = activeDeck.srcs.map(src => new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = "h-full w-auto";
        img.draggable = false;
        img.onload = resolve;
        img.onerror = reject;
        content.appendChild(img);
    }));

    Promise.all(imagePromises).then(() => {
      // Reseta a visão quando as imagens carregam
      setZoomLevel(1.0);
      const viewportRect = viewportRef.current.getBoundingClientRect();
      state.translate.x = (viewportRect.width - content.offsetWidth) / 2;
      state.translate.y = (viewportRect.height - content.offsetHeight) / 2;
      clampPosition();
      updateTransform();
      setIsLoading(false);
    });
  }, [activeDeck]);
  
  // Efeito para adicionar e remover os event listeners (mouse, toque, roda)
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.07 : 1 / 1.07;
      setZoomLevel(prevZoom => {
        const newZoomLevel = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * zoomFactor));
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
        const imageX = (mouseX - state.translate.x) / prevZoom;
        const imageY = (mouseY - state.translate.y) / prevZoom;
        state.translate.x = mouseX - imageX * newZoomLevel;
        state.translate.y = mouseY - imageY * newZoomLevel;
        clampPosition();
        updateTransform();
        return newZoomLevel;
      });
    };

    const startDrag = (x, y) => {
      state.isDragging = true;
      viewport.classList.add('grabbing');
      cancelAnimationFrame(state.animationFrameId);
      state.velocity = { x: 0, y: 0 };
      state.lastTouch = { x, y };
    };

    const doDrag = (x, y) => {
      if (!state.isDragging) return;
      const deltaX = x - state.lastTouch.x;
      const deltaY = y - state.lastTouch.y;
      state.translate.x += deltaX;
      state.translate.y += deltaY;
      state.velocity = { x: deltaX, y: deltaY };
      state.lastTouch = { x, y };
      clampPosition();
      updateTransform();
    };
    
    const inertiaLoop = () => {
      if (state.isDragging) return;
      state.translate.x += state.velocity.x;
      state.translate.y += state.velocity.y;
      state.velocity.x *= FRICTION;
      state.velocity.y *= FRICTION;
      clampPosition();
      updateTransform();
      if (Math.abs(state.velocity.x) > 0.1 || Math.abs(state.velocity.y) > 0.1) {
        state.animationFrameId = requestAnimationFrame(inertiaLoop);
      }
    };

    const endDrag = () => {
      if (!state.isDragging) return;
      state.isDragging = false;
      viewport.classList.remove('grabbing');
      requestAnimationFrame(inertiaLoop);
    };

    const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
    const handleMouseMove = (e) => doDrag(e.clientX, e.clientY);
    const handleTouchStart = (e) => e.touches.length > 0 && startDrag(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e) => e.touches.length > 0 && doDrag(e.touches[0].clientX, e.touches[0].clientY);

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    viewport.addEventListener('mousedown', handleMouseDown);
    viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);
    window.addEventListener('mouseleave', endDrag);

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      viewport.removeEventListener('mousedown', handleMouseDown);
      viewport.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchend', endDrag);
      window.removeEventListener('mouseleave', endDrag);
      cancelAnimationFrame(state.animationFrameId);
    };
  }, [state]);

  // Expõe funções para serem chamadas pelo componente pai (App.jsx)
  useImperativeHandle(ref, () => ({
    zoomIn: () => handleZoom({ deltaY: -1 }),
    zoomOut: () => handleZoom({ deltaY: 1 }),
    resetView: () => {
      setZoomLevel(1.0);
      const content = contentRef.current;
      const viewportRect = viewportRef.current.getBoundingClientRect();
      state.translate.x = (viewportRect.width - content.offsetWidth) / 2;
      state.translate.y = (viewportRect.height - content.offsetHeight) / 2;
      clampPosition();
      updateTransform();
    }
  }));

  const handleZoom = (e) => {
      const viewport = viewportRef.current;
      const rect = viewport.getBoundingClientRect();
      const fakeEvent = {
          ...e,
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
          preventDefault: () => {}
      };
      viewport.dispatchEvent(new WheelEvent('wheel', fakeEvent));
  }

  return (
    <div ref={viewportRef} className="relative w-full h-full max-w-[90vh] max-h-[90vw] aspect-square bg-black rounded-full overflow-hidden border-8 border-slate-700 shadow-2xl cursor-grab">
      <div ref={contentRef} className="absolute pointer-events-none" style={{ transformOrigin: '0 0' }}></div>
      {isLoading && <Loader />}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/50 px-4 py-2 rounded-md">
          <span className="text-lg font-medium">Zoom: {zoomLevel.toFixed(1)}x</span>
      </div>
    </div>
  );
});

export default Microscope;
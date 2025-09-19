import { useState, useEffect, useRef, useCallback } from 'react';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 20.0;
const FRICTION = 0.95;

export default function useMicroscope(viewportRef, contentRef, activeDeck) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const state = useRef({
    isDragging: false,
    velocity: { x: 0, y: 0 },
    lastTouch: { x: 0, y: 0 },
    animationFrameId: null,
  }).current;

  const clampPosition = useCallback(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const viewportRect = viewport.getBoundingClientRect();
    const scaledWidth = content.offsetWidth * zoomLevel;
    const scaledHeight = content.offsetHeight * zoomLevel;

    setTranslate(currentTranslate => ({
      x: Math.max(viewportRect.width - scaledWidth, Math.min(0, currentTranslate.x)),
      y: Math.max(viewportRect.height - scaledHeight, Math.min(0, currentTranslate.y)),
    }));
  }, [viewportRef, contentRef, zoomLevel]);

  const inertiaLoop = useCallback(() => {
    if (state.isDragging) return;

    setTranslate(currentTranslate => ({
      x: currentTranslate.x + state.velocity.x,
      y: currentTranslate.y + state.velocity.y,
    }));

    state.velocity.x *= FRICTION;
    state.velocity.y *= FRICTION;

    clampPosition();

    if (Math.abs(state.velocity.x) > 0.1 || Math.abs(state.velocity.y) > 0.1) {
      state.animationFrameId = requestAnimationFrame(inertiaLoop);
    }
  }, [state, clampPosition]);

  const resetView = useCallback(() => {
    setZoomLevel(1.0);
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const viewportRect = viewport.getBoundingClientRect();
    setTranslate({
      x: (viewportRect.width - content.offsetWidth) / 2,
      y: (viewportRect.height - content.offsetHeight) / 2,
    });
  }, [viewportRef, contentRef]);

  useEffect(() => {
    if (activeDeck) {
      resetView();
    }
  }, [activeDeck, resetView]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;

      setZoomLevel(prevZoom => {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom * zoomFactor));
        const rect = viewport.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setTranslate(currentTranslate => {
          const imageX = (mouseX - currentTranslate.x) / prevZoom;
          const imageY = (mouseY - currentTranslate.y) / prevZoom;
          return {
            x: mouseX - imageX * newZoom,
            y: mouseY - imageY * newZoom,
          };
        });
        return newZoom;
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

      setTranslate(currentTranslate => ({
        x: currentTranslate.x + deltaX,
        y: currentTranslate.y + deltaY,
      }));

      state.velocity = { x: deltaX, y: deltaY };
      state.lastTouch = { x, y };
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
  }, [state, inertiaLoop, viewportRef]);

  useEffect(() => {
    clampPosition();
  }, [translate, zoomLevel, clampPosition]);

  const zoomIn = () => {
    setZoomLevel(z => Math.min(MAX_ZOOM, z * 1.2));
  };

  const zoomOut = () => {
    setZoomLevel(z => Math.max(MIN_ZOOM, z / 1.2));
  };

  return {
    zoomLevel,
    translate,
    resetView,
    zoomIn,
    zoomOut,
  };
}

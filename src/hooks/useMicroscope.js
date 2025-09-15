import { useState, useRef } from "react";

export default function useMicroscope() {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 15.0;
  const ZOOM_STEP = 0.5;

  const updateTransform = (x, y) => {
    setTranslate({ x, y });
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  const zoomOut = () => setZoomLevel((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));

  const startDrag = (x, y) => {
    isDragging.current = true;
    lastTouch.current = { x, y };
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  const doDrag = (x, y) => {
    if (!isDragging.current) return;
    const dx = x - lastTouch.current.x;
    const dy = y - lastTouch.current.y;
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
    lastTouch.current = { x, y };
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomAmount = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    setZoomLevel((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * zoomAmount)));
  };

  return {
    zoomLevel,
    translate,
    zoomIn,
    zoomOut,
    startDrag,
    endDrag,
    doDrag,
    handleWheel,
  };
}

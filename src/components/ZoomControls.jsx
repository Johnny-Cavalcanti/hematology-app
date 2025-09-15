export default function ZoomControls({ zoomLevel, onZoomIn, onZoomOut }) {
  return (
    <div className="mt-6 flex items-center space-x-4">
      <button
        onClick={onZoomOut}
        className="bg-gray-700 hover:bg-gray-600 transition-colors text-white font-bold rounded-full text-2xl w-14 h-14 flex items-center justify-center shadow-lg"
      >
        -
      </button>
      <span className="text-xl w-28 text-center bg-gray-900/50 px-3 py-1 rounded-md">
        Zoom: {zoomLevel.toFixed(1)}x
      </span>
      <button
        onClick={onZoomIn}
        className="bg-gray-700 hover:bg-gray-600 transition-colors text-white font-bold rounded-full text-2xl w-14 h-14 flex items-center justify-center shadow-lg"
      >
        +
      </button>
    </div>
  );
}

export default function SlideSelector({ slides, activeSlide, onSelect }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-2 md:gap-4 max-w-4xl mx-auto">
      {slides.map((slide, index) => (
        <button
          key={index}
          className={`slide-selector transition-all duration-200 text-white font-bold py-2 px-4 rounded-lg shadow-md ${
            activeSlide === index
              ? "bg-cyan-800 border-2 border-cyan-300 scale-105"
              : "bg-gray-700 hover:bg-cyan-800"
          }`}
          onClick={() => onSelect(index)}
        >
          {slide.label}
        </button>
      ))}
    </div>
  );
}

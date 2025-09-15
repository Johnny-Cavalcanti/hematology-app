import { useState } from "react";
import Header from "./components/Header";
import SlideSelector from "./components/SlideSelector";
import Microscope from "./components/Microscope";
import ZoomControls from "./components/ZoomControls";
import useMicroscope from "./hooks/useMicroscope";

const SLIDES = [
  {
    label: "Lâmina Contínua (1+2)",
    srcs: ["https://i.postimg.cc/SK176WFp/lma-1.png", "https://i.postimg.cc/CLCGPyT7/lma-2.png"],
  },
  {
    label: "Lâmina Contínua (3+4)",
    srcs: ["https://i.postimg.cc/9FHPYmSz/lma-3.png", "https://i.postimg.cc/vBfL6h92/linfocito-reativo.png"],
  },
  {
    label: "Lâmina Contínua (4+5+6)",
    srcs: [
      "https://i.postimg.cc/vBfL6h92/linfocito-reativo.png",
      "https://i.postimg.cc/g0Y1kwZZ/eritroblastos.png",
      "https://i.postimg.cc/W3zKgQSp/lamina-normal.png",
    ],
  },
  {
    label: "Lâmina Contínua (7+6)",
    srcs: [
      "https://i.postimg.cc/KvpzvRxW/fagott-cells.png",
      "https://i.postimg.cc/W3zKgQSp/lamina-normal.png",
    ],
  },
  {
    label: "Lâmina Contínua (8+9+10)",
    srcs: [
      "https://i.postimg.cc/8PzcShQW/bastonete-de-auer.png",
      "https://i.postimg.cc/nhJD6Hcd/desvio-a-esquerda.png",
      "https://i.postimg.cc/2j1hWcKx/linfocitos.png",
    ],
  },
];

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const microscope = useMicroscope();

  return (
    <div className="bg-gray-800 text-white flex flex-col items-center justify-center min-h-screen p-4 antialiased select-none">
      <Header />
      <SlideSelector slides={SLIDES} activeSlide={activeSlide} onSelect={setActiveSlide} />
      <Microscope
        images={SLIDES[activeSlide].srcs}
        zoomLevel={microscope.zoomLevel}
        translate={microscope.translate}
        onStartDrag={microscope.startDrag}
        onEndDrag={microscope.endDrag}
        onDrag={microscope.doDrag}
        onWheel={microscope.handleWheel}
      />
      <ZoomControls
        zoomLevel={microscope.zoomLevel}
        onZoomIn={microscope.zoomIn}
        onZoomOut={microscope.zoomOut}
      />
    </div>
  );
}


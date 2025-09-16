import { useState, useEffect, useRef } from 'react';

// Importando seus componentes existentes
import Header from './components/Header';
import Microscope from './components/Microscope';
import ZoomControls from './components/ZoomControls';
import SlideSelector from './components/SlideSelector';

import { microscopyData } from './data/microscopyData';

function App() {
  const [currentCategoryKey, setCurrentCategoryKey] = useState(Object.keys(microscopyData)[0]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref para acessar as funções do componente Microscope (zoom, reset)
  const microscopeRef = useRef();

  // Efeito para carregar a primeira lâmina da categoria ao iniciar ou trocar de categoria
  useEffect(() => {
    const slidesInCategory = microscopyData[currentCategoryKey] || [];
    setActiveDeck(slidesInCategory.length > 0 ? slidesInCategory[0] : null);
  }, [currentCategoryKey]);

  const handleSelectDeck = (deck) => {
    setActiveDeck(deck);
    setIsModalOpen(false);
  };

  // Funções para os controles de zoom que chamam os métodos no componente Microscope
  const handleZoomIn = () => microscopeRef.current?.zoomIn();
  const handleZoomOut = () => microscopeRef.current?.zoomOut();
  const handleResetView = () => microscopeRef.current?.resetView();

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-900 text-slate-200 antialiased">
      {/* A Barra Lateral é composta pelos seus componentes Header e ZoomControls */}
      <aside className="w-full md:w-80 lg:w-96 bg-slate-800/50 p-6 flex flex-col border-b-2 md:border-b-0 md:border-r-2 border-slate-700">
        <Header
          categories={Object.keys(microscopyData)}
          currentCategoryKey={currentCategoryKey}
          setCurrentCategoryKey={setCurrentCategoryKey}
          activeDeck={activeDeck}
          onOpenModal={() => setIsModalOpen(true)}
        />
        <ZoomControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetView}
        />
      </aside>
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Microscope ref={microscopeRef} activeDeck={activeDeck} />
      </main>

      {isModalOpen && (
        <SlideSelector
          categoryKey={currentCategoryKey}
          decks={microscopyData[currentCategoryKey]}
          onSelectDeck={handleSelectDeck}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

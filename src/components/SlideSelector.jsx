import React from 'react';

const SlideSelector = ({ categoryKey, decks, onSelectDeck, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Laminário: {categoryKey}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </header>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar">
          {decks?.length > 0 ? decks.map((deck) => (
            <button key={deck.title} onClick={() => onSelectDeck(deck)} className="bg-slate-700/50 rounded-lg p-3 text-left hover:bg-slate-700 transition-colors">
              <img src={deck.srcs[0]} className="w-full h-32 object-cover rounded-md mb-3" draggable="false" alt={deck.title} />
              <h3 className="font-semibold text-white truncate">{deck.title}</h3>
              <p className="text-xs text-slate-400">{deck.srcs.length} imagem(ns)</p>
            </button>
          )) : (
            <p className="text-slate-400 text-center col-span-full">Nenhuma lâmina disponível para esta categoria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlideSelector;

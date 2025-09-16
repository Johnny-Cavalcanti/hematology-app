import React from 'react';

const Header = ({ categories, currentCategoryKey, setCurrentCategoryKey, activeDeck, onOpenModal }) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-10 h-10 text-sky-400" viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/>
        </svg>
        <div>
          <h1 className="text-xl font-bold text-white">Scope Digital</h1>
          <p className="text-sm text-slate-400">Microscópio Virtual Profissional</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Área de Análise</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((key) => (
          <button
            key={key}
            onClick={() => setCurrentCategoryKey(key)}
            className={`font-semibold py-2 px-3 text-sm rounded-full transition-colors ${currentCategoryKey === key ? 'active-category' : 'bg-slate-700 hover:bg-slate-600'}`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Lâmina Ativa</h2>
        <p className="text-white font-semibold truncate">{activeDeck?.title || 'Nenhuma'}</p>
      </div>
      
      <button onClick={onOpenModal} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200">
        Selecionar Lâmina
      </button>
    </>
  );
};

export default Header;

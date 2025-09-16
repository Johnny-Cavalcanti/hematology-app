import React from 'react';

const ZoomControls = ({ onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="mt-auto pt-6">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Controles</h2>
      <div className="grid grid-cols-3 gap-3">
        <button onClick={onReset} className="bg-slate-700 hover:bg-slate-600 transition-colors p-3 rounded-lg flex justify-center items-center" title="Resetar Visão">
          <svg className="w-6 h-6" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.696a8.25 8.25 0 00-11.664 0l-3.181 3.183" /></svg>
        </button>
        <button onClick={onZoomOut} className="bg-slate-700 hover:bg-slate-600 transition-colors p-3 rounded-lg flex justify-center items-center" title="Diminuir Zoom">
          <svg className="w-6 h-6" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" /></svg>
        </button>
        <button onClick={onZoomIn} className="bg-slate-700 hover:bg-slate-600 transition-colors p-3 rounded-lg flex justify-center items-center" title="Aumentar Zoom">
          <svg className="w-6 h-6" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;

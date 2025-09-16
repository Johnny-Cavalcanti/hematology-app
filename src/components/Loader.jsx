import React from 'react';

const Loader = () => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
      <div className="w-12 h-12 border-4 border-slate-500 border-t-sky-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
import React from 'react';
const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      {/* Visual Element */}
      <div className="relative">
        <h1 className="text-[12rem] font-extrabold text-purple-100 leading-none select-none">404</h1>
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-slate-800 whitespace-nowrap">
          Oops! Lost your way?
        </p>
      </div>

      {/* Content */}
      <div className="max-w-md text-center mt-8">
        <p className="text-lg text-slate-600 mb-8">The page you're looking for doesn't exist or has been moved to a different galaxy.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-200 active:scale-95"
        >Back to Safety</a>
      </div>
    </div>
  );
};

export default NotFound;
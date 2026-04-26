import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
  </div>
);

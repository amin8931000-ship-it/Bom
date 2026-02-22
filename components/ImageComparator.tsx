
import React, { useState, useRef, useEffect } from 'react';

interface Props {
  before: string;
  after: string;
}

const ImageComparator: React.FC<Props> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in event 
      ? event.touches[0].clientX - rect.left 
      : (event as React.MouseEvent).clientX - rect.left;
    
    const position = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* After Image (Full Background) */}
      <img 
        src={after} 
        alt="After" 
        className="absolute inset-0 w-full h-full object-cover" 
      />

      {/* Before Image (Clipped Overlay) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={before} 
          alt="Before" 
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${10000 / sliderPosition}%` }} // CSS trick for responsive scaling
        />
        <div className="absolute top-4 left-4 bg-black/60 px-2 py-1 text-[10px] rounded uppercase tracking-widest border border-white/20">Original</div>
      </div>

      <div className="absolute top-4 right-4 bg-red-600/80 px-2 py-1 text-[10px] rounded uppercase tracking-widest border border-red-400/50">Enhanced</div>

      {/* Slider Bar */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l-4 4m0 0l4 4m-4-4h18" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l4-4m0 0l-4-4m4 4H2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparator;

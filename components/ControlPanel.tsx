
import React from 'react';
import { EnhancementParams, EnhancementModel } from '../types';

interface Props {
  params: EnhancementParams;
  onChange: (updates: Partial<EnhancementParams>) => void;
  disabled?: boolean;
}

const ControlPanel: React.FC<Props> = ({ params, onChange, disabled }) => {
  return (
    <div className="space-y-6 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Enhancement Model</label>
        <select 
          disabled={disabled}
          value={params.model}
          onChange={(e) => onChange({ model: e.target.value as EnhancementModel })}
          className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all"
        >
          {Object.values(EnhancementModel).map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex justify-between">
          Creativity <span>{Math.round(params.creativity * 100)}%</span>
        </label>
        <input 
          type="range"
          min="0"
          max="1"
          step="0.05"
          disabled={disabled}
          value={params.creativity}
          onChange={(e) => onChange({ creativity: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <p className="text-[10px] text-gray-500 mt-1">High creativity adds more realistic details but may hallucinate textures.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Upscale Factor</label>
          <div className="flex bg-black/50 border border-white/10 rounded-lg p-1">
            {["2x", "4x"].map(factor => (
              <button
                key={factor}
                disabled={disabled}
                onClick={() => onChange({ upscaleFactor: factor as any })}
                className={`flex-1 py-1 text-xs rounded-md transition-all ${params.upscaleFactor === factor ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {factor}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Subject Detection</label>
          <select 
            disabled={disabled}
            value={params.subjectDetection}
            onChange={(e) => onChange({ subjectDetection: e.target.value as any })}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-red-500 outline-none"
          >
            <option value="Foreground">Foreground Only</option>
            <option value="Full Image">Full Image</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-red-600/5 border border-red-600/20 rounded-lg">
        <div>
          <h4 className="text-sm font-semibold">Face Enhancement</h4>
          <p className="text-[10px] text-gray-400">Deep-learning facial restoration</p>
        </div>
        <button 
          disabled={disabled}
          onClick={() => onChange({ faceEnhancement: !params.faceEnhancement })}
          className={`w-12 h-6 rounded-full transition-colors relative ${params.faceEnhancement ? 'bg-red-600' : 'bg-gray-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${params.faceEnhancement ? 'left-7' : 'left-1'}`} />
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;

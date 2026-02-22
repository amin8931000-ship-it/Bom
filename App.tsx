
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageComparator from './components/ImageComparator';
import { EnhancementParams, EnhancementModel, EnhancementResult } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<EnhancementResult | null>(null);
  
  const [params, setParams] = useState<EnhancementParams>({
    model: EnhancementModel.LOW_RES_V2,
    creativity: 0.5,
    faceEnhancement: true,
    subjectDetection: "Foreground",
    upscaleFactor: "4x"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
      setError(null);
    }
  };

  const updateParams = (updates: Partial<EnhancementParams>) => {
    setParams(prev => ({ ...prev, ...updates }));
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const enhancedUrl = await geminiService.enhanceImage(selectedFile, params);
      setResults({
        originalUrl: previewUrl!,
        enhancedUrl,
        timestamp: Date.now()
      });
    } catch (err) {
      setError("An error occurred while enhancing your image. Please ensure your API key is valid and try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Upload & Results */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Image Studio</h2>
              <p className="text-gray-400">Professional AI enhancement and detail restoration.</p>
            </div>

            <div className="relative group">
              {!previewUrl ? (
                <label className="block w-full aspect-[16/9] border-2 border-dashed border-white/10 rounded-3xl bg-white/5 hover:bg-white/[0.08] hover:border-red-600/50 transition-all cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold mb-2">Drop your image here</p>
                    <p className="text-gray-500 text-sm">Supports JPG, PNG, WEBP (Max 10MB)</p>
                  </div>
                </label>
              ) : results ? (
                <div className="animate-in fade-in zoom-in duration-500">
                  <ImageComparator before={results.originalUrl} after={results.enhancedUrl} />
                  <div className="mt-4 flex gap-4">
                    <button 
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); setResults(null); }}
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-bold"
                    >
                      Process New Image
                    </button>
                    <a 
                      href={results.enhancedUrl} 
                      download="enhanced-crimsonlens.png"
                      className="flex-1 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition-all text-sm font-bold text-center"
                    >
                      Download Result
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 bg-black">
                  <img src={previewUrl} className="w-full h-full object-contain" alt="Preview" />
                  <button 
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-red-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-center">
                        <p className="text-white font-bold tracking-widest uppercase text-sm">Enhancing Image</p>
                        <p className="text-gray-400 text-xs mt-1">Applying neural detail reconstruction...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-600/50 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
          </div>

          {/* Right Side: Controls */}
          <div className="lg:col-span-4 sticky top-32 space-y-6">
            <ControlPanel 
              params={params} 
              onChange={updateParams} 
              disabled={isProcessing || !previewUrl || !!results}
            />

            <button 
              onClick={handleEnhance}
              disabled={!previewUrl || isProcessing || !!results}
              className={`w-full py-4 rounded-2xl font-bold tracking-widest uppercase text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                !previewUrl || isProcessing || !!results
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white red-glow-hover hover:bg-red-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run AI Enhancement
                </>
              )}
            </button>

            <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-[11px] text-gray-500 leading-relaxed">
              <span className="text-red-500 font-bold block mb-1">PRO TIP</span>
              High Fidelity models perform best on portraits. Use Natural Pro for landscapes and architectural photography to avoid artifacts.
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center transform rotate-45">
              <span className="text-white font-bold -rotate-45 text-[10px]">C</span>
            </div>
            <span className="font-brand text-xs tracking-tighter text-white">CRIMSONLENS AI</span>
          </div>
          <p className="text-xs text-gray-500">© 2024 CrimsonLens. Powered by Gemini Pro Vision.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-400 hover:text-red-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-red-500 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-gray-400 hover:text-red-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

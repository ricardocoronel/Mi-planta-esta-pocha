import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { AnalysisChart } from './components/AnalysisChart';
import { analyzePlantImage } from './services/aiService';
import { AnalysisState } from './types';
import { Leaf, Sprout, Send, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null
  });

  const handleAnalyze = async () => {
    if (!image) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await analyzePlantImage(image, additionalInfo);
      setState({ isLoading: false, error: null, result });
    } catch (err: any) {
      setState({
        isLoading: false,
        error: err.message || "Ocurrió un error inesperado",
        result: null
      });
    }
  };

  const handleReset = () => {
    setImage(null);
    setAdditionalInfo('');
    setState({ isLoading: false, error: null, result: null });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="bg-emerald-100 p-2 rounded-lg">
                <Leaf size={24} className="text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">BotanIA</h1>
          </div>
          {!state.result && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Asistente IA Beta
              </span>
          )}
          {state.result && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                  <RefreshCw size={16} />
                  <span>Nueva consulta</span>
              </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-8">
        
        {/* Intro Section (only show if no result) */}
        {!state.result && !state.isLoading && (
            <div className="text-center mb-10 space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
                    ¿Qué le pasa a tu planta? 🌱
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Sube una foto y obtén un diagnóstico instantáneo, identificación y consejos de cuidado por IA.
                </p>
            </div>
        )}

        {/* Upload Section */}
        {!state.result && (
          <div className={`transition-all duration-500 ${state.isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-emerald-50/50">
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                    1. Sube una foto clara
                </label>
                <ImageUpload 
                    selectedImage={image} 
                    onImageSelected={setImage} 
                    onClear={() => setImage(null)} 
                />
              </div>

              <div className="mb-8">
                 <label className="block text-sm font-semibold text-gray-700 mb-2 pl-1">
                    2. Información extra (opcional)
                </label>
                <textarea
                  className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none text-gray-700"
                  rows={3}
                  placeholder="Ej: La riego cada semana, está cerca de la ventana..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!image || state.isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
                  ${!image 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white shadow-emerald-200 shadow-lg hover:bg-emerald-700 hover:shadow-xl'
                  }
                `}
              >
                {state.isLoading ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Analizando...
                    </>
                ) : (
                    <>
                        <Sprout size={24} />
                        Diagnosticar Planta
                    </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {state.error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-start gap-3 mt-6 animate-in fade-in slide-in-from-bottom-4">
                <AlertCircle className="shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold">Algo salió mal</p>
                    <p className="text-sm opacity-90">{state.error}</p>
                </div>
            </div>
        )}

        {/* Results Section */}
        {state.result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {image && (
                        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg">
                            <img src={URL.createObjectURL(image)} alt="Original" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-emerald-50 mb-3">
                            {state.result.confidence === 'high' ? 'Identificación segura' : 'Identificación probable'}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">{state.result.identifiedName}</h2>
                        <p className="text-emerald-100/90 text-sm md:text-base leading-relaxed">
                            Aquí tienes el reporte completo de tu planta. Sigue los consejos de abajo para mejorar su salud.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats / Charts Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                   <h4 className="text-sm font-semibold text-gray-500 mb-2">Salud General</h4>
                   <div className="h-32 w-full -mt-4">
                       <AnalysisChart 
                         score={state.result.healthScore} 
                         label="Salud" 
                         color={
                           state.result.healthScore > 75 ? '#10b981' : 
                           state.result.healthScore > 40 ? '#f59e0b' : '#ef4444'
                         } 
                       />
                   </div>
                </div>
                 <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <h4 className="text-sm font-semibold text-gray-500 mb-4">Confianza IA</h4>
                    <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2
                        ${state.result.confidence === 'high' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}
                    `}>
                        {state.result.confidence === 'high' ? 'A+' : 'B'}
                    </div>
                    <p className="text-xs text-gray-400 px-4">
                        {state.result.confidence === 'high' ? 'Alta certeza en el diagnóstico' : 'Diagnóstico aproximado'}
                    </p>
                </div>
            </div>

            {/* Markdown Content */}
            <MarkdownRenderer content={state.result.markdownText} />

            {/* New Query Button (Floating on mobile bottom or inline) */}
            <div className="pt-8 flex justify-center">
                <button 
                    onClick={handleReset}
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-colors shadow-lg flex items-center gap-2"
                >
                    <Send size={18} />
                    Consultar otra planta
                </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="mt-12 text-center text-gray-400 text-sm pb-8">
        <p>© 2024 BotanIA. Powered by Gemini & OpenAI.</p>
      </footer>
    </div>
  );
};

export default App;

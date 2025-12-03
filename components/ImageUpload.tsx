import React, { useCallback, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, selectedImage, onClear }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if(file.type.startsWith('image/')) {
            onImageSelected(file);
        }
    }
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg group">
        <img 
          src={URL.createObjectURL(selectedImage)} 
          alt="Preview" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
                onClick={onClear}
                className="bg-white/90 text-red-600 p-3 rounded-full hover:bg-white transition-transform hover:scale-110 shadow-lg"
            >
                <X size={32} />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-64 md:h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden group
        ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30"}
      `}
      onDragEnter={handleDrag} 
      onDragLeave={handleDrag} 
      onDragOver={handleDrag} 
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        accept="image/*"
        onChange={handleChange}
      />
      
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 group-hover:scale-110 transition-transform duration-300">
            <Camera size={40} />
        </div>
        <div>
            <p className="text-lg font-semibold text-gray-700">Toca para tomar foto o subir</p>
            <p className="text-sm text-gray-500 mt-1">o arrastra la imagen aquí</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            <Upload size={12} />
            <span>Soporta JPG, PNG, WEBP</span>
        </div>
      </div>
    </div>
  );
};

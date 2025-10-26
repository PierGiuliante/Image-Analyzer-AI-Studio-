
import React, { useState, useCallback, useRef } from 'react';
import { analyzeImage, findSimilarImages } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { SimilarImage } from './types';
import Loader from './components/Loader';
import ResultsDisplay from './components/ResultsDisplay';

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const App: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [description, setDescription] = useState<string>('');
    const [similarImages, setSimilarImages] = useState<SimilarImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
            setError(null);
            setDescription('');
            setSimilarImages([]);
        } else {
            setError('Please select a valid image file.');
        }
    };

    const handleAnalyzeClick = useCallback(async () => {
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setDescription('');
        setSimilarImages([]);

        try {
            setLoadingMessage('Converting image...');
            const { mimeType, data } = await fileToBase64(imageFile);

            setLoadingMessage('Analizzando l\'immagine...');
            const desc = await analyzeImage(data, mimeType);
            setDescription(desc);

            setLoadingMessage('Trovando immagini simili...');
            const similar = await findSimilarImages(desc);
            setSimilarImages(similar);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [imageFile]);
    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImageUrl(URL.createObjectURL(file));
            setError(null);
            setDescription('');
            setSimilarImages([]);
        }
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
            <style>{`
              @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        AI Image Analyzer
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">Carica una foto per ottenere un'analisi dettagliata e scoprire immagini simili.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center space-y-6">
                        <div 
                            className="w-full max-w-md p-4 bg-gray-800 rounded-2xl shadow-lg border-2 border-dashed border-gray-600 hover:border-purple-400 transition-colors duration-300 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {imageUrl ? (
                                <img src={imageUrl} alt="Uploaded preview" className="w-full h-auto max-h-96 object-contain rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <UploadIcon />
                                    <p className="mt-2 font-semibold text-gray-300">Trascina un'immagine o clicca per caricare</p>
                                    <p className="text-sm text-gray-500">PNG, JPG, GIF, WEBP</p>
                                </div>
                            )}
                        </div>
                        
                        {imageFile && (
                            <button
                                onClick={handleAnalyzeClick}
                                disabled={isLoading}
                                className="w-full max-w-md px-6 py-3 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50"
                            >
                                {isLoading ? 'Analisi in corso...' : 'Analizza Immagine'}
                            </button>
                        )}
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                       {isLoading ? (
                           <Loader message={loadingMessage} />
                       ) : error ? (
                           <div className="w-full bg-red-900 bg-opacity-50 text-red-300 border border-red-500 p-4 rounded-lg text-center">
                               <p className="font-bold">Error</p>
                               <p>{error}</p>
                           </div>
                       ) : (
                           <ResultsDisplay description={description} similarImages={similarImages} />
                       )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;

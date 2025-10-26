
import React from 'react';
import type { SimilarImage } from '../types';

interface ResultsDisplayProps {
  description: string;
  similarImages: SimilarImage[];
}

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
    </svg>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ description, similarImages }) => {
  return (
    <div className="w-full space-y-8">
      {description && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in-up">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Descrizione dell'Immagine</h2>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      )}
      {similarImages.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Pagine con Immagini Simili</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarImages.map((image, index) => (
              <a
                key={index}
                href={image.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                    <p className="text-purple-300 font-semibold truncate pr-2">{image.title}</p>
                    <LinkIcon />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;

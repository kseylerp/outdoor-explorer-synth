
import React from 'react';

interface ImageGalleryProps {
  images: File[];
  removeImage: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, removeImage }) => {
  if (images.length === 0) return null;
  
  return (
    <div className="mb-4">
      <p className="text-sm mb-2 font-medium">Uploaded Images ({images.length})</p>
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img 
              src={URL.createObjectURL(image)} 
              alt={`Uploaded ${index}`} 
              className="h-16 w-16 object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;

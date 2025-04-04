
import React from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  setFormImages: (files: File[]) => void;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  setImages, 
  setFormImages,
  error 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedImages = [...images, ...newFiles];
      setImages(updatedImages);
      setFormImages(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    setFormImages(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Activity Images</label>
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Images
          </Button>
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Uploaded ${index}`}
              className="h-32 w-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs truncate mt-1">{image.name}</p>
          </div>
        ))}

        {images.length === 0 && (
          <div className="h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <p className="text-sm text-gray-500">No images uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

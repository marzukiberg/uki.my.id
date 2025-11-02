import React, { useState, useEffect } from "react";
import Image from "next/image";

const LibrarySelector = ({ isOpen, onClose, onSelectImage }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imagePath) => {
    console.log("LibrarySelector: handleImageSelect called with:", imagePath);
    onSelectImage(imagePath);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Select Image from Library</h3>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading images...</div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">No images found in library</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 hover:ring-2 hover:ring-blue-500"
                  onClick={() => handleImageSelect(image.path)}
                >
                  <Image
                    src={image.path}
                    alt={image.name}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 transition-all group-hover:bg-opacity-20" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="truncate rounded bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                      {image.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibrarySelector;

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useUpload from "../../hooks/useUpload";
import LibrarySelector from "./LibrarySelector";
import { Images } from "lucide-react";

const Dropzone = ({
  field,
  formData,
  setTouched,
  errors = {},
  touched = {},
}) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const lastProcessedImageRef = useRef(null);
  const {
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
    error: uploadError,
  } = useUpload();

  const handleImageError = (imageId) => {
    setUploadedImages((prev) =>
      prev.map((img) => {
        if (img.id === imageId && img.possiblePaths) {
          const currentIndex = img.possiblePaths.indexOf(img.path);
          const nextIndex = currentIndex + 1;
          if (nextIndex < img.possiblePaths.length) {
            return { ...img, path: img.possiblePaths[nextIndex] };
          }
        }
        return img;
      })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const isMultiple = field.multiple !== false;

    if (!isMultiple && files.length > 1) {
      alert("Only one file can be dropped.");
      return;
    }

    if (files.length > 0) {
      try {
        const results = await uploadMultipleFiles(files);
        console.log("Raw results from uploadMultipleFiles:", results);

        const uploadedFiles = results.map((result, index) => ({
          id: Date.now() + Math.random() + index,
          path: result.path,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
        }));

        console.log("Processed uploadedFiles:", uploadedFiles);
        if (!isMultiple) {
          // For single file, replace existing
          setUploadedImages(uploadedFiles);
        } else {
          setUploadedImages((prev) => {
            const updated = [...prev, ...uploadedFiles];
            console.log("Updated uploadedImages state (handleDrop):", updated);
            return updated;
          });
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        alert("Error uploading files. Please try again.");
      }
    }
  };

  const handleClick = () => {
    document.getElementById(field.name).click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.currentTarget.files);
    const isMultiple = field.multiple !== false;

    if (!isMultiple && files.length > 1) {
      alert("Only one file can be selected.");
      return;
    }

    if (files.length > 0) {
      try {
        const results = await uploadMultipleFiles(files);

        const uploadedFiles = results.map((result, index) => ({
          id: Date.now() + Math.random() + index,
          path: result.path,
          filename: result.filename,
          originalName: result.originalName,
          size: result.size,
        }));

        if (!isMultiple) {
          // For single file, replace existing
          setUploadedImages(uploadedFiles);
        } else {
          setUploadedImages((prev) => [...prev, ...uploadedFiles]);
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        alert("Error uploading files. Please try again.");
      }
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleLibrarySelect = (imagePath) => {
    console.log("handleLibrarySelect called with imagePath:", imagePath);
    const isMultiple = field.multiple !== false;
    const selectedImage = {
      id: Date.now() + Math.random(),
      path: imagePath,
      filename: imagePath.split("/").pop(),
      originalName: imagePath.split("/").pop(),
      size: 0, // We don't have size info from library
    };

    console.log("Created selectedImage:", selectedImage);

    if (!isMultiple) {
      // For single file, replace existing
      setUploadedImages([selectedImage]);
    } else {
      setUploadedImages((prev) => {
        const updated = [...prev, selectedImage];
        console.log("Updated uploadedImages state:", updated);
        console.log("uploadedImages length after update:", updated.length);
        return updated;
      });
    }
  };

  // Handle initial value for editing
  const currentFieldValue = formData[field.name];
  useEffect(() => {
    if (
      currentFieldValue &&
      typeof currentFieldValue === "string" &&
      uploadedImages.length === 0
    ) {
      // Try different paths for the image
      const possiblePaths = [
        currentFieldValue.startsWith("http")
          ? currentFieldValue
          : `/img/logos/${currentFieldValue}`,
        `/uploads/${currentFieldValue}`,
        currentFieldValue.startsWith("/")
          ? currentFieldValue
          : `/${currentFieldValue}`,
      ];

      const initialImage = {
        id: Date.now() + Math.random(),
        path: possiblePaths[0], // Start with logos path
        filename: currentFieldValue,
        originalName: currentFieldValue,
        size: 0,
        possiblePaths, // Store possible paths for fallback
      };
      setUploadedImages([initialImage]);
    }
  }, [currentFieldValue, field.name, uploadedImages.length, formData]);

  const hasError = errors[field.name] && touched[field.name];
  const dropzoneClassName = `flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 hover:bg-gray-100 ${
    hasError ? "border-red-500" : "border-gray-300"
  } ${isUploading ? "opacity-50 pointer-events-none" : ""}`;

  return (
    <div className="space-y-4">
      <div
        className={dropzoneClassName}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onBlur={() => setTouched && setTouched(field.name, true)}
      >
        <ion-icon
          name="cloud-upload-outline"
          className="text-4xl text-gray-400"
        ></ion-icon>
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        {field.accept && (
          <p className="text-xs text-gray-500">({field.accept})</p>
        )}
        {isUploading && (
          <div className="mt-2 w-full">
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-blue-500">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
        {uploadError && (
          <p className="mt-2 text-xs text-red-500">{uploadError}</p>
        )}
        <input
          id={field.name}
          name={field.name}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={field.accept}
          multiple={field.multiple !== false}
        />
      </div>

      {/* Library Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsLibraryOpen(true)}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Images className="mr-2 h-4 w-4" />
          Choose from Library
        </button>
      </div>

      {/* Image Library Preview */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {uploadedImages.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={image.path}
                  alt={image.originalName}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                  onError={() => handleImageError(image.id)}
                  unoptimized
                />
              </div>
              {/* Remove button */}
              <button
                onClick={() => removeImage(image.id)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              >
                ×
              </button>
              {/* Image info */}
              <p
                className="mt-1 truncate text-xs text-gray-500"
                title={image.originalName}
              >
                {image.originalName}
              </p>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <span className="mt-1 text-xs text-red-500">{errors[field.name]}</span>
      )}

      {/* Library Selector Modal */}
      <LibrarySelector
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectImage={handleLibrarySelect}
      />
    </div>
  );
};

export default Dropzone;

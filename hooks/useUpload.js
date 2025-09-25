import { useState, useCallback } from "react";

const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) {
      throw new Error("No file provided");
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Upload failed");
      }

      setUploadProgress(100);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(
            `Upload failed for ${file.name}: ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("API response for file", file.name, ":", result);

        if (!result.success) {
          throw new Error(result.message || `Upload failed for ${file.name}`);
        }

        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100);

        return {
          ...result,
          originalFile: file,
        };
      });

      const results = await Promise.all(uploadPromises);
      console.log("All upload results:", results);
      setUploadProgress(100);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
};

export default useUpload;

import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actionButtonText,
  onSubmit,
  cancelButtonText,
  onCancel,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Match the duration of the fadeOut animation
  }, [onClose]);

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = ""; // Re-enable background scrolling
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, handleClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .modal-overlay {
                animation: ${isClosing
                ? "fadeOut 0.3s ease-out forwards"
                : "fadeIn 0.3s ease-out"
              };
              }
              .modal-content {
                animation: ${isClosing
                ? "slideOut 0.3s ease-out forwards"
                : "slideIn 0.3s ease-out"
              };
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes slideOut {
                from {
                  opacity: 1;
                  transform: translateY(0);
                }
                to {
                  opacity: 0;
                  transform: translateY(-20px);
                }
              }
            `,
          }}
        />
      </Head>
      <div
        className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        onClick={handleClose}
      >
        <div
          className="modal-content relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="flex-shrink-0 border-b p-6">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-500 transition-colors duration-200 hover:text-gray-700"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {title && (
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            )}
          </div>
          <div className="flex-grow overflow-y-auto p-6">{children}</div>
          {(actionButtonText || cancelButtonText) && (
            <div className="flex-shrink-0 border-t p-6">
              <div className="flex justify-end space-x-2">
                {cancelButtonText && (
                  <Button variant="outline" onClick={handleCancel}>
                    {cancelButtonText}
                  </Button>
                )}
                {actionButtonText && onSubmit && (
                  <Button onClick={onSubmit}>{actionButtonText}</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;

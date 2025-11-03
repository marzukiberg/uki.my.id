import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const PhotoSlider = ({
    images,
    imageCount,
    onImageClick,
    activeIndex: activeIndexProp,
    onIndexChange,
    className = "",
    showCounter = true,
}) => {
    const [localIndex, setLocalIndex] = useState(
        typeof activeIndexProp === "number" ? activeIndexProp : 0
    );

    // keep local index in sync when parent controls activeIndex
    useEffect(() => {
        if (typeof activeIndexProp === "number") {
            setLocalIndex(activeIndexProp);
        }
    }, [activeIndexProp]);

    if (!images || images.length === 0) {
        return null;
    }

    const hasMultipleImages = images.length > 1;

    return (
        <>
            <style jsx global>{`
        .photo-slider {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .photo-slider .swiper {
          position: relative;
          background: #f8f9fa;
        }
        .slide-item {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          padding: 20px;
          background: white;
        }
        .slide-item img {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: ${onImageClick ? "pointer" : "default"};
          transition: transform 0.2s ease-in-out;
        }
        ${onImageClick
                    ? `
        .slide-item img:hover {
          transform: scale(1.02);
        }
        `
                    : ""}

        /* Swiper custom styles */
        .photo-slider .swiper-button-prev,
        .photo-slider .swiper-button-next {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(6px) !important;
          color: #374151 !important;
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          margin-top: -18px !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
          opacity: 0.85 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
        }

        .photo-slider .swiper-button-prev:hover,
        .photo-slider .swiper-button-next:hover {
          background: rgba(255, 255, 255, 1) !important;
          opacity: 1 !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
        }

        .photo-slider .swiper-button-prev::after,
        .photo-slider .swiper-button-next::after {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #374151 !important;
          line-height: 1 !important;
        }

        /* Target SVG icons specifically */
        .photo-slider .swiper-button-prev svg,
        .photo-slider .swiper-button-next svg {
          width: 12px !important;
          height: 12px !important;
          color: #374151 !important;
        }

        .photo-slider .swiper-pagination {
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          display: flex !important;
          gap: 6px !important;
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(10px) !important;
          padding: 6px 10px !important;
          border-radius: 16px !important;
          width: auto !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        .photo-slider .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          border-radius: 50% !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.4) !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          margin: 0 !important;
          opacity: 1 !important;
        }

        .photo-slider .swiper-pagination-bullet:hover {
          background: rgba(255, 255, 255, 0.7) !important;
          transform: scale(1.3) !important;
        }

        .photo-slider .swiper-pagination-bullet-active {
          background: rgba(255, 255, 255, 1) !important;
          width: 20px !important;
          border-radius: 4px !important;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>

            <div className={`photo-slider ${className}`}>
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={hasMultipleImages}
                    pagination={hasMultipleImages ? { clickable: true } : false}
                    loop={false}
                    className="photo-slider-swiper"
                    onSlideChange={(swiper) => {
                        if (typeof onIndexChange === "function") onIndexChange(swiper.activeIndex);
                        else setLocalIndex(swiper.activeIndex);
                    }}
                    initialSlide={
                        typeof activeIndexProp === "number" ? activeIndexProp : localIndex
                    }
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="slide-item">
                                {image.type === "video" ? (
                                    <video
                                        src={image.url}
                                        controls
                                        controlsList="nodownload"
                                        className="h-auto max-h-96 w-full object-contain"
                                        poster="" // No poster needed for blob videos
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <Image
                                        src={image.url}
                                        alt={image.alt || `Media ${index + 1}`}
                                        width={400}
                                        height={400}
                                        className="h-auto max-h-96 w-full object-contain"
                                        unoptimized // Since we're using blob URLs
                                        onClick={() => {
                                            if (typeof onIndexChange === "function") onIndexChange(index);
                                            else setLocalIndex(index);
                                            if (typeof onImageClick === "function") onImageClick(index);
                                        }}
                                    />
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {showCounter && images.length > 1 && (
                    <div className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                        {localIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </>
    );
};

export default PhotoSlider;

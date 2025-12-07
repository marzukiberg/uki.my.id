import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Download, BookOpen, User, Calendar, FileText, HardDrive } from "lucide-react";
import { IconButton } from "../v2/IconButton";

const BookCard = ({ book, onDownload }) => {
    const [downloading, setDownloading] = useState(false);
    const [cover, setCover] = useState(null);
    const cardRef = useRef(null);

    useEffect(() => {
        setCover(null); // Reset cover when book changes
    }, [book.id]);

    const fetchCover = useCallback(async () => {
        try {
            const response = await fetch(`/api/book-cover?id=${book.id}`);
            if (response.ok) {
                const data = await response.json();
                setCover(data.cover);
            }
        } catch (error) {
            console.error('Error fetching cover:', error);
        }
    }, [book.id]);

    useEffect(() => {
        const currentRef = cardRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !cover) {
                        fetchCover();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [cover, fetchCover]);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await onDownload(book.mirrors[0]);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div ref={cardRef} className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex space-x-4">
                <div className="flex-shrink-0">
                    {cover ? (
                        <Image
                            src={cover}
                            alt={book.title}
                            width={64}
                            height={96}
                            className="h-24 w-16 rounded-lg object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex h-24 w-16 items-center justify-center rounded-lg bg-gray-100">
                            <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {book.title}
                    </h3>
                    <div className="mt-1 space-y-1">
                        {book.author && (
                            <div className="flex items-center text-xs text-gray-600">
                                <User className="mr-1 h-3 w-3" />
                                {book.author}
                            </div>
                        )}
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                            {book.year && (
                                <div className="flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {book.year}
                                </div>
                            )}
                            {book.pages && (
                                <div className="flex items-center">
                                    <FileText className="mr-1 h-3 w-3" />
                                    {book.pages} pages
                                </div>
                            )}
                            {book.size && (
                                <div className="flex items-center">
                                    <HardDrive className="mr-1 h-3 w-3" />
                                    {book.size}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                {book.extension?.toUpperCase()}
                            </span>
                            <IconButton
                                onClick={handleDownload}
                                loading={downloading}
                                className="h-8 w-8"
                            >
                                <Download className="h-4 w-4" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
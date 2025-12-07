import { useMutation } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import BookCard from "../../components/ui/BookCard";
import DownloaderForm from "../../components/ui/DownloaderForm";
import ErrorDisplay from "../../components/ui/ErrorDisplay";
import { SITE_CONFIG, TOOLS } from "../../lib/constants";

const BookSearchPage = () => {
    const [activeTab, setActiveTab] = useState("Book Search");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const searchMutation = useMutation({
        mutationFn: async (searchQuery) => {
            const response = await fetch("/api/book-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: searchQuery }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to search books");
            }

            return response.json();
        },
        onSuccess: (data) => {
            setResults(data.items || []);
            setError("");
        },
        onError: (err) => {
            setError(err.message || "Failed to search books");
            setResults([]);
        },
    });

    const downloadMutation = useMutation({
        mutationFn: async (mirrorUrl) => {
            const response = await fetch("/api/book-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mirror: mirrorUrl }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to get download link");
            }

            return response.json();
        },
        onSuccess: (data) => {
            if (data.downloadUrl) {
                // Trigger download
                const a = document.createElement("a");
                a.href = data.downloadUrl;
                a.download = "";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        },
        onError: (err) => {
            setError(err.message || "Failed to download book");
        },
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        searchMutation.mutate(query);
    };

    return (
        <AppLayout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            meta={{
                title: `${TOOLS.bookSearch.title} | Find Books Online`,
                description: TOOLS.bookSearch.description,
                keywords: TOOLS.bookSearch.keywords,
                ogImage: `${SITE_CONFIG.url}/img/book-search-og-image.jpg`,
                canonicalPath: TOOLS.bookSearch.path,
            }}
        >
            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4">
                    <h1 className="mb-4 flex items-center justify-center space-x-2 text-center text-3xl font-light text-gray-800">
                        <Search className="h-8 w-8" />
                        <span>Book Search</span>
                    </h1>
                    <p className="mb-6 text-center text-gray-600">
                        Search for books and find download links from various sources.
                    </p>

                    <DownloaderForm
                        url={query}
                        setUrl={setQuery}
                        loading={searchMutation.isPending}
                        onSubmit={handleFormSubmit}
                        placeholder="Enter book title, author, or ISBN..."
                        showSecret={false}
                        type="text"
                    />

                    <ErrorDisplay error={error} />

                    {results.length > 0 && (
                        <div className="mt-8">
                            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
                                Search Results ({results.length} books found)
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {results.map((book, index) => (
                                    <BookCard
                                        key={index}
                                        book={book}
                                        onDownload={downloadMutation.mutateAsync}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default BookSearchPage;
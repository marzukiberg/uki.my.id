import Link from "next/link";
import * as Icons from "lucide-react";
import Brand from "../Brand";
import { Button } from "./Button";

const SearchSection = ({ searchQuery, setSearchQuery, handleSearch, handleFeelingLucky }) => {
    return (
        <div id="search" className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full text-center">
                {/* Logo or Title */}
                <div id="logo" className="mb-4 md:mb-6 text-center">
                    <Link href="/">
                        <Brand className="text-4xl md:text-6xl font-bold flex justify-center cursor-pointer" />
                    </Link>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="mb-4 relative max-w-md mx-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-full bg-gray-100 px-6 py-3 pr-24 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search..."
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
                        <button type="button" className="p-2 hover:bg-gray-200 rounded-full">
                            <Icons.Mic size={20} className="text-gray-600" />
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-200 rounded-full">
                            <Icons.Camera size={20} className="text-gray-600" />
                        </button>
                        <button type="submit" className="p-2 hover:bg-gray-200 rounded-full">
                            <Icons.Search size={20} className="text-gray-600" />
                        </button>
                    </div>
                </form>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button onClick={handleSearch}>
                        Search
                    </Button>
                    <Button variant="secondary" onClick={handleFeelingLucky}>
                        I&apos;m feeling lucky
                    </Button>
                </div>

                {/* Quick Links */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600 mb-2 text-sm">Quick Search:</p>
                    <div className="flex flex-wrap justify-center gap-1">
                        <a
                            href="https://pdfmu.my.id/pdf-cv-review"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-gray-100 px-6 py-2 text-gray-700 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Review your CV using AI
                        </a>
                        <a
                            href="https://chattoai.ukay.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-gray-100 px-6 py-2 text-gray-700 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Chat to AI to get insight
                        </a>
                        <a
                            href="https://remover.ukay.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-gray-100 px-6 py-2 text-gray-700 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Remove background from photos
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;
import Link from "next/link";
import * as Icons from "lucide-react";
import Brand from "../Brand";

const SearchSection = ({ searchQuery, setSearchQuery, handleSearch, handleFeelingLucky }) => {
    return (
        <div id="search" className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md text-center">
                {/* Logo or Title */}
                <div id="logo" className="mb-6 md:mb-8 text-center">
                    <Link href="/">
                        <Brand className="text-4xl md:text-6xl font-bold flex justify-center cursor-pointer" />
                    </Link>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="mb-4 relative">
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
                    <button
                        onClick={handleSearch}
                        className="rounded-full bg-blue-600 px-8 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleFeelingLucky}
                        className="rounded-full border border-gray-300 bg-transparent px-8 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        I&apos;m feeling lucky
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchSection;
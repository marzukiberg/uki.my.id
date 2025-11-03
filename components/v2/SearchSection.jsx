import Link from "next/link";
import * as Icons from "lucide-react";
import Brand from "../Brand";
import { Button } from "./Button";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleFeelingLucky,
}) => {
  return (
    <div
      id="search"
      className="flex min-h-screen flex-col items-center justify-center px-4"
    >
      <div className="w-full text-center">
        {/* Logo or Title */}
        <div id="logo" className="mb-4 text-center md:mb-6">
          <Link href="/">
            <Brand className="flex cursor-pointer justify-center text-4xl font-bold md:text-6xl" />
          </Link>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearch}
          className="relative mx-auto mb-4 max-w-md"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-gray-100 px-6 py-3 pr-24 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-lg"
            placeholder="Search..."
          />
          <div className="absolute right-4 top-1/2 flex -translate-y-1/2 transform items-center space-x-3">
            <button
              type="button"
              className="rounded-full p-2 hover:bg-gray-200"
            >
              <Icons.Mic size={20} className="text-gray-600" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 hover:bg-gray-200"
            >
              <Icons.Camera size={20} className="text-gray-600" />
            </button>
            <button
              type="submit"
              className="rounded-full p-2 hover:bg-gray-200"
            >
              <Icons.Search size={20} className="text-gray-600" />
            </button>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="secondary" onClick={handleFeelingLucky}>
            I&apos;m feeling lucky
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-4 text-center">
          <p className="mb-2 text-sm text-gray-600">Quick Search:</p>
          <div className="flex flex-wrap justify-center gap-1">
            <a
              href="https://pdfmu.my.id/pdf-cv-review"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Review your CV using AI
            </a>
            <a
              href="https://chattoai.ukay.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Chat to AI to get insight
            </a>
            <a
              href="https://remover.ukay.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
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

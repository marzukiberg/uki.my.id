import Link from "next/link";
import Brand from "../Brand";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleFeelingLucky,
}) => {
  return (
    <div
      id="search"
      className="flex flex-col items-center justify-center px-4 pt-12 pb-16 md:pt-20 md:pb-24"
    >
      <div className="w-full max-w-2xl text-center">
        {/* Google Logo / Brand */}
        <div id="logo" className="mb-7 text-center md:mb-8 select-none">
          <Link href="/">
            <Brand className="flex cursor-pointer justify-center text-6xl font-medium tracking-tight md:text-8xl" />
          </Link>
          <p className="mt-2 text-xs font-medium text-gray-500 tracking-wider md:text-sm">
            Frontend Engineer &bull; Fullstack Developer
          </p>
        </div>

        {/* Google-style Search Input */}
        <form
          onSubmit={handleSearch}
          className="relative mx-auto mb-7 w-full max-w-[584px]"
        >
          <div className="flex h-11 sm:h-12 w-full items-center rounded-full border border-gray-200 bg-white px-4 shadow-xs transition-all hover:border-transparent hover:shadow-md focus-within:border-transparent focus-within:shadow-md">
            {/* Google Search Magnifier Icon */}
            <svg
              className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400"
              focusable="false"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full flex-1 bg-transparent text-sm text-gray-900 focus:outline-none md:text-base"
              placeholder="Search or ask anything about Marzuki..."
            />

            {/* Clear Button if input has text */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                title="Clear"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Google Mic & Lens Colored SVG Icons */}
            <div className="flex items-center gap-2 pl-1 border-l border-gray-200">
              {/* Google Colored Mic Icon */}
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
                title="Search by voice"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="m12 15c1.66 0 3-1.34 3-3v-6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z"/>
                  <path fill="#34a853" d="m11 18.08h2v3.92h-2z"/>
                  <path fill="#fbbc05" d="m7.05 10.95c-.55 0-1 .45-1 1 0 3.28 2.67 5.95 5.95 5.95v-2c-2.18 0-3.95-1.77-3.95-3.95 0-.55-.45-1-1-1z"/>
                  <path fill="#ea4335" d="m16.95 10.95c-.55 0-1 .45-1 1 0 2.18-1.77 3.95-3.95 3.95v2c3.28 0 5.95-2.67 5.95-5.95 0-.55-.45-1-1-1z"/>
                </svg>
              </button>

              {/* Google Colored Lens Icon */}
              <button
                type="button"
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 focus:outline-none"
                title="Search by image"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  <path fill="#ea4335" d="M17.5 7A2.5 2.5 0 0 0 15 4.5H9A2.5 2.5 0 0 0 6.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2.5zM12 18.5A4.5 4.5 0 1 1 12 9.5a4.5 4.5 0 0 1 0 9z" />
                  <path fill="#fbbc05" d="M19 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                  <path fill="#34a853" d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Authentic Google-style Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleSearch}
            className="rounded border border-[#f8f9fa] bg-[#f8f9fa] px-4 py-2 text-sm text-[#3c4043] transition-all hover:border-[#dadce0] hover:bg-[#f8f9fa] hover:text-[#202124] hover:shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            Google Search
          </button>
          <button
            onClick={handleFeelingLucky}
            className="rounded border border-[#f8f9fa] bg-[#f8f9fa] px-4 py-2 text-sm text-[#3c4043] transition-all hover:border-[#dadce0] hover:bg-[#f8f9fa] hover:text-[#202124] hover:shadow-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            I&apos;m Feeling Lucky
          </button>
          <a
            href="/Marzuki_Front-End_Developer_Resume_ATS.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded border border-blue-600/20 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100/80 hover:shadow-xs focus:outline-none"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Download CV
          </a>
        </div>

        {/* Google-style "Google offered in:" Quick Search Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-[#4d5156] sm:text-sm">
          <span>Quick links:</span>
          <a
            href="https://pdfmu.web.id/pdf-cv-review"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a0dab] hover:underline"
          >
            Review CV AI
          </a>
          <span className="text-gray-300">&bull;</span>
          <a
            href="https://agent-loker.web.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a0dab] hover:underline"
          >
            AI Job Search
          </a>
          <span className="text-gray-300">&bull;</span>
          <a
            href="https://dokumin.web.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1a0dab] hover:underline"
          >
            Download Premium Docs
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;

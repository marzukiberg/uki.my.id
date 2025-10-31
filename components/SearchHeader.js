import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import * as Icons from 'lucide-react';
import Brand from './Brand';
import AppsMenuButton from './ui/apps-menu-button';

const SearchHeader = ({ activeTab, setActiveTab, tabs }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(router.query.q || "I'm a Frontend Developer");

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/about?q=${searchQuery}`);
  };

  return (
    <header className="w-full">
      {/* Mobile Layout */}
      <div className="md:hidden p-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <Brand className="text-2xl font-bold cursor-pointer" />
          </Link>
          <div className="flex items-center space-x-4">
            <AppsMenuButton />
            <button onClick={() => router.push('/about')} className="p-1 rounded-full hover:bg-gray-100">
              <Image src="/img/profile.jpeg" alt="Profile" width={32} height={32} className="rounded-full object-cover" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-gray-100 px-6 py-3 pr-32 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Brand className="text-2xl font-bold cursor-pointer" />
            </Link>
            <form onSubmit={handleSearch} className="relative min-w-[50vw]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-gray-100 px-6 py-3 pr-32 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>
          <div className="flex items-center space-x-4">
            <AppsMenuButton />
            <button onClick={() => router.push('/about')} className="p-1 rounded-full hover:bg-gray-100">
              <Image src="/img/profile.jpeg" alt="Profile" width={32} height={32} className="rounded-full object-cover" />
            </button>
          </div>
        </div>
      </div>
      {/* Tabs (link-based) */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-8 border-b border-gray-200">
          {tabs.map((t) => {
            const href = t.href || (t === 'Semua' ? '/about' : '/portfolio');
            const label = t.label || t;
            const isActive = router.pathname === href || router.asPath.startsWith(href);
            return (
              <Link key={label} href={href} className={`py-2 px-1 border-b-2 font-medium text-sm ${isActive ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
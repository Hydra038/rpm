"use client";
import { useState, useEffect, useMemo } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  products: Product[];
}

export function SearchBar({ onSearch, products }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('rpm-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (searchQuery: string) => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
      const updated = [searchQuery, ...recentSearches.slice(0, 4)];
      setRecentSearches(updated);
      localStorage.setItem('rpm-recent-searches', JSON.stringify(updated));
    }
  };

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    return products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [query, products]);

  const popularSearches = ['brake pads', 'oil filter', 'spark plugs', 'air filter', 'battery'];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    saveSearch(searchQuery);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for parts by name, part number, or vehicle..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
          }}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              onSearch('');
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Dropdown */}
      {isFocused && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsFocused(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-96 overflow-y-auto">
            {/* Product Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Products
                </div>
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSearch(product.name)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      £{product.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-gray-700">{search}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = recentSearches.filter((_, i) => i !== index);
                        setRecentSearches(updated);
                        localStorage.setItem('rpm-recent-searches', JSON.stringify(updated));
                      }}
                      className="p-1 h-auto opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {!query && (
              <div className="p-2 border-t border-gray-100">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-1 px-3">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
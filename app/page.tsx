'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const InfiniteScroll = dynamic(() => import('react-infinite-scroll-component'), {
  ssr: false
});

interface City {
  name: string;
  cou_name_en: string;
}

export default function Home() {
  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records`,
        {
          params: {
            limit: 20,
            offset: page * 20,
            where: search ? `search(name, "${search}")` : undefined,
            order_by: 'name ASC',
          },
        }
      );

      const newCities = response.data.results.map((city: any) => ({
        name: city.name,
        cou_name_en: city.cou_name_en,
      }));

      setCities((prev) => [...prev, ...newCities]);
      setHasMore(newCities.length === 20);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCities([]);
    setPage(0);
    setHasMore(true);
    fetchCities();
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (!mounted) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search for a city..."
              value=""
              onChange={() => {}}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 shadow-sm"
            />
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 text-center text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Weather Forecast
        </h1>
        
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search for a city..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">City Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cities.map((city, index) => (
                  <tr key={`${city.name}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <a
                        href={`/weather/${city.name}`}
                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                      >
                        {city.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{city.cou_name_en}</td>
                  </tr>
                ))}
                {hasMore && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center">
                      <button
                        onClick={fetchCities}
                        disabled={isLoading}
                        className={`text-blue-600 hover:text-blue-800 font-medium ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                            Loading...
                          </span>
                        ) : (
                          'Load More'
                        )}
                      </button>
                    </td>
                  </tr>
                )}
                {!hasMore && cities.length > 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                      No more cities to load
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export default function WeatherPage({ params }: { params: { city: string } }) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              q: params.city,
              appid: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
              units: unit,
            },
          }
        );
        setWeatherData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [params.city, unit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const getWeatherIcon = (iconCode: string) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Search
        </a>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{weatherData.name}</h1>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setUnit('metric')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    unit === 'metric'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  °C
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    unit === 'imperial'
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-6 mb-8">
                  <img
                    src={getWeatherIcon(weatherData.weather[0].icon)}
                    alt={weatherData.weather[0].description}
                    className="w-24 h-24"
                  />
                  <div>
                    <h2 className="text-5xl font-bold text-gray-800 mb-2">
                      {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                    </h2>
                    <p className="text-xl text-gray-600 capitalize">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-[300px] rounded-xl overflow-hidden shadow-md">
                <MapContainer
                  center={[weatherData.coord.lat, weatherData.coord.lon]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[weatherData.coord.lat, weatherData.coord.lon]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-gray-800">{weatherData.name}</h3>
                        <p className="text-gray-600">{weatherData.weather[0].description}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
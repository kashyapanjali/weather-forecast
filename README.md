# Weather Forecast Web Application

A modern weather forecast web application built with Next.js, TypeScript, and Tailwind CSS. The application allows users to search for cities, view their weather information, and see the location on a map.

## Features

- City search with infinite scroll
- Real-time weather information
- Interactive map with city location
- Temperature unit conversion (Celsius/Fahrenheit)
- Responsive design
- Dynamic weather-based backgrounds
- Error handling
- Loading states

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- OpenWeatherMap API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-forecast
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your OpenWeatherMap API key:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Keys

### OpenWeatherMap API
1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add the API key to your `.env.local` file

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Axios
- React Leaflet
- MobX State Tree
- Heroicons

## Project Structure

```
weather-forecast/
├── app/
│   ├── components/
│   ├── weather/
│   │   └── [city]/
│   │       └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for the weather API
- [OpenStreetMap](https://www.openstreetmap.org/) for the map tiles
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling

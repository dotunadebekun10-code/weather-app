import { useState } from 'react'

import './App.css'

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)

  async function handleSearch() {
    setLoading(true);
    setError(null);
    if (!city || city.trim() === "") {
      setError("Please enter a city name");
      setWeather(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError(null);
      } else {
        setWeather(null);
        setError("City not found!");
      }
    } catch (error) {
      setWeather(null);
      setError("Error fetching weather data!");
      console.log(error);
    } finally {
      setLoading(false);
    }

  }



  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 p-2 flex items-center justify-center">
        <div className="w-full max-w-md p-6 rounded-lg bg-white/20 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-white mb-3">Weather App</h1>

          <div className="flex gap-3">
            <input type="text"
              placeholder="Enter city name"
              className="border border-emerald-300 w-full bg-white/20 placeholder:text-white/60 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-500"
              value={city}
              onKeyDown={(e) => {
                if (e.key === "Enter" && city.trim() !== "") {
                  handleSearch();
                }
              }}
              onChange={(e) => {
                setCity(e.target.value);
                setError(null);
              }}
            />
            <button
              onClick={handleSearch}
              className='bg-emerald-800 hover:bg-emerald-600 py-2 px-4 rounded-lg text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
          {error && (
            <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mt-3 border border-red-200">{error}</p>
          )}

          {weather && (
            <div className='border border-white/20 shadow-xl mt-4 bg-white/30 backdrop-blur-md p-4 rounded-2xl '>
              <div className="flex items-center justify-between my-4">
                <p className='text-5xl font-black text-white'>{Math.round(weather.main.temp)}°C</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} alt={weather.weather[0].description} className='w-24 drop-shadow-lg' />
              </div>

              <div className='flex items-center justify-between '>
                <h2 className='text-xl font-bold text-white'>{weather.name}</h2>
                <p className='text-white'>{weather.sys.country}</p>
              </div>

              {/* bottom grid */}
              <div className="grid grid-cols-3 gap-4 mt-6 border-t border-white/20 pt-4 text-white">
                <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
                  <p className='text-white font-semibold text-xs uppercase'>Humidity</p>
                  <p className='mt-2 text-lg font-bold'>{weather.main.humidity}%</p>
                </div>
                <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
                  <p className='text-white font-semibold text-xs uppercase'>Conditions</p>
                  <p className='mt-2 text-sm font-bold capitalize'>{weather.weather[0].description}</p>
                </div>
                <div className="flex flex-col items-center bg-white/10 p-2 rounded-lg">
                  <p className='text-white font-semibold text-xs uppercase'>Feels Like</p>
                  <p className='mt-2 text-md font-bold'>{Math.round(weather.main.feels_like)}°C</p>
                </div>

              </div>
            </div>
          )}


        </div>
      </div>
    </>
  )
}

export default App

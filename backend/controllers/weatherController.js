const axios = require('axios');
const User = require('../models/User');

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get current weather for a city
 * GET /api/weather/current
 */
exports.getCurrentWeather = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;

        let url;

        if (lat && lon) {
            // Use coordinates
            url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        } else if (city) {
            // Use city name
            url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide city name or coordinates (lat, lon)'
            });
        }

        const response = await axios.get(url);
        const data = response.data;

        // Format the response
        const weatherData = {
            city: data.name,
            country: data.sys.country,
            coordinates: {
                lat: data.coord.lat,
                lon: data.coord.lon
            },
            temperature: {
                current: Math.round(data.main.temp),
                feels_like: Math.round(data.main.feels_like),
                min: Math.round(data.main.temp_min),
                max: Math.round(data.main.temp_max)
            },
            weather: {
                main: data.weather[0].main,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                icon_url: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
            },
            details: {
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                visibility: data.visibility / 1000, // Convert to km
                wind_speed: data.wind.speed,
                wind_direction: data.wind.deg,
                clouds: data.clouds.all
            },
            sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
            sunset: new Date(data.sys.sunset * 1000).toISOString(),
            timezone: data.timezone,
            timestamp: new Date(data.dt * 1000).toISOString()
        };

        // Check for rewards (if authenticated)
        let reward = null;
        console.log('[DEBUG] req.user:', JSON.stringify(req.user));
        if (req.user && req.user.id !== undefined && req.user.id !== null) {
            try {
                console.log(`[Reward] Processing for user ${req.user.id}`);
                reward = User.incrementSearchCount(req.user.id);
                console.log(`[Reward] Result:`, reward);
            } catch (err) {
                console.error('Reward error:', err);
            }
        } else {
            console.log('[Reward] No user authenticated');
        }

        res.json({
            success: true,
            data: weatherData,
            meta: {
                reward
            }
        });

    } catch (error) {
        console.error('Weather API error:', error.response?.data || error.message);

        if (error.response?.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching weather data'
        });
    }
};

/**
 * Get 5-day weather forecast
 * GET /api/weather/forecast
 */
exports.getForecast = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;

        let url;

        if (lat && lon) {
            url = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        } else if (city) {
            url = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Please provide city name or coordinates (lat, lon)'
            });
        }

        const response = await axios.get(url);
        const data = response.data;

        // Group forecasts by day
        const dailyForecasts = {};

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();

            if (!dailyForecasts[date]) {
                dailyForecasts[date] = {
                    date: new Date(item.dt * 1000).toISOString().split('T')[0],
                    temps: [],
                    weather: item.weather[0],
                    humidity: [],
                    wind: []
                };
            }

            dailyForecasts[date].temps.push(item.main.temp);
            dailyForecasts[date].humidity.push(item.main.humidity);
            dailyForecasts[date].wind.push(item.wind.speed);
        });

        // Calculate daily averages
        const forecast = Object.values(dailyForecasts).slice(0, 5).map(day => ({
            date: day.date,
            temperature: {
                min: Math.round(Math.min(...day.temps)),
                max: Math.round(Math.max(...day.temps)),
                avg: Math.round(day.temps.reduce((a, b) => a + b, 0) / day.temps.length)
            },
            weather: {
                main: day.weather.main,
                description: day.weather.description,
                icon: day.weather.icon,
                icon_url: `https://openweathermap.org/img/wn/${day.weather.icon}@4x.png`
            },
            humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
            wind_speed: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length * 10) / 10
        }));

        res.json({
            success: true,
            data: {
                city: data.city.name,
                country: data.city.country,
                forecast
            }
        });

    } catch (error) {
        console.error('Forecast API error:', error.response?.data || error.message);

        if (error.response?.status === 404) {
            return res.status(404).json({
                success: false,
                message: 'City not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching forecast data'
        });
    }
};

import api from './api';

/**
 * Get current weather for a city or coordinates
 * @param {Object} options - { city?: string, lat?: number, lon?: number }
 * @returns {Promise<Object>} Weather data
 */
export const getCurrentWeather = async ({ city, lat, lon }) => {
    try {
        let params = {};

        if (lat !== undefined && lon !== undefined) {
            params = { lat, lon };
        } else if (city) {
            params = { city };
        } else {
            return { success: false, message: 'Please provide city or coordinates' };
        }

        const response = await api.get('/weather/current', { params });

        if (response.data.success) {
            return { success: true, data: response.data.data };
        }

        return { success: false, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch weather';
        return { success: false, message };
    }
};

/**
 * Get 5-day weather forecast
 * @param {Object} options - { city?: string, lat?: number, lon?: number }
 * @returns {Promise<Object>} Forecast data
 */
export const getForecast = async ({ city, lat, lon }) => {
    try {
        let params = {};

        if (lat !== undefined && lon !== undefined) {
            params = { lat, lon };
        } else if (city) {
            params = { city };
        } else {
            return { success: false, message: 'Please provide city or coordinates' };
        }

        const response = await api.get('/weather/forecast', { params });

        if (response.data.success) {
            return { success: true, data: response.data.data };
        }

        return { success: false, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to fetch forecast';
        return { success: false, message };
    }
};

/**
 * Get weather icon based on condition
 * @param {string} iconCode - OpenWeather icon code
 * @returns {string} Emoji representation
 */
export const getWeatherEmoji = (iconCode) => {
    const iconMap = {
        '01d': '☀️', '01n': '🌙',  // Clear sky
        '02d': '⛅', '02n': '☁️',   // Few clouds
        '03d': '☁️', '03n': '☁️',  // Scattered clouds
        '04d': '☁️', '04n': '☁️',  // Broken clouds
        '09d': '🌧️', '09n': '🌧️', // Shower rain
        '10d': '🌦️', '10n': '🌧️', // Rain
        '11d': '⛈️', '11n': '⛈️', // Thunderstorm
        '13d': '❄️', '13n': '❄️',  // Snow
        '50d': '🌫️', '50n': '🌫️', // Mist
    };
    return iconMap[iconCode] || '🌡️';
};

/**
 * Format temperature display
 * @param {number} temp - Temperature in Celsius
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (temp) => {
    return `${Math.round(temp)}°`;
};

/**
 * Get day name from date string
 * @param {string} dateStr - ISO date string
 * @returns {string} Day name
 */
export const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    }

    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export default {
    getCurrentWeather,
    getForecast,
    getWeatherEmoji,
    formatTemperature,
    getDayName,
};

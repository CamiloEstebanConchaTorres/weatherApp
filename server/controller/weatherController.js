const axios = require('axios');

const weatherController = {
    async getCurrentWeather(req, res) {
        try {
            const { city = 'Járkov' } = req.params;
            const apiKey = process.env.WEATHER_API_KEY;
            
            const response = await axios.get(
                `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&lang=es`
            );
            
            const data = response.data;
            
            const weatherData = {
                location: {
                    city: data.location.name,
                    country: data.location.country
                },
                current: {
                    temp_c: Math.round(data.current.temp_c),
                    feelslike_c: Math.round(data.current.feelslike_c),
                    condition: {
                        text: data.current.condition.text,
                        icon: data.current.condition.icon
                    },
                    wind_kph: data.current.wind_kph,
                    pressure_mb: data.current.pressure_mb,
                    precip_mm: data.current.precip_mm,
                    uv: data.current.uv
                },
                forecast: {
                    daily: data.forecast.forecastday.map(day => ({
                        date: day.date,
                        day_name: new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' }),
                        max_temp: Math.round(day.day.maxtemp_c),
                        min_temp: Math.round(day.day.mintemp_c),
                        condition: {
                            text: day.day.condition.text,
                            icon: day.day.condition.icon
                        }
                    })),
                    hourly: data.forecast.forecastday[0].hour
                        .filter(hour => {
                            const hourTime = new Date(hour.time).getHours();
                            const currentHour = new Date().getHours();
                            return hourTime >= currentHour;
                        })
                        .slice(0, 6)
                        .map(hour => ({
                            time: new Date(hour.time).getHours() + ':00',
                            temp_c: Math.round(hour.temp_c),
                            condition: {
                                text: hour.condition.text,
                                icon: hour.condition.icon
                            },
                            chance_of_rain: hour.chance_of_rain
                        }))
                },
                astronomy: {
                    sunrise: data.forecast.forecastday[0].astro.sunrise,
                    sunset: data.forecast.forecastday[0].astro.sunset
                }
            };

            res.json(weatherData);
        } catch (error) {
            console.error('Error en weatherController:', error);
            res.status(500).json({
                error: 'Error al obtener datos del clima',
                details: error.message
            });
        }
    },

    async getHourlyForecast(req, res) {
        try {
            const { city = 'Járkov' } = req.params;
            const apiKey = process.env.WEATHER_API_KEY;
            
            const response = await axios.get(
                `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&lang=es`
            );
            
            const hourlyData = response.data.forecast.forecastday[0].hour
                .filter(hour => {
                    const hourTime = new Date(hour.time).getHours();
                    const currentHour = new Date().getHours();
                    return hourTime >= currentHour;
                })
                .slice(0, 6)
                .map(hour => ({
                    time: new Date(hour.time).getHours() + ':00',
                    temp_c: Math.round(hour.temp_c),
                    condition: {
                        text: hour.condition.text,
                        icon: hour.condition.icon
                    },
                    chance_of_rain: hour.chance_of_rain
                }));

            res.json(hourlyData);
        } catch (error) {
            console.error('Error en hourlyForecast:', error);
            res.status(500).json({
                error: 'Error al obtener pronóstico por hora',
                details: error.message
            });
        }
    },

    async getDailyForecast(req, res) {
        try {
            const { city = 'Járkov' } = req.params;
            const apiKey = process.env.WEATHER_API_KEY;
            
            const response = await axios.get(
                `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=no&lang=es`
            );
            
            const dailyData = response.data.forecast.forecastday.map(day => ({
                date: day.date,
                day_name: new Date(day.date).toLocaleDateString('es-ES', { weekday: 'short' }),
                max_temp: Math.round(day.day.maxtemp_c),
                min_temp: Math.round(day.day.mintemp_c),
                condition: {
                    text: day.day.condition.text,
                    icon: day.day.condition.icon
                }
            }));

            res.json(dailyData);
        } catch (error) {
            console.error('Error en dailyForecast:', error);
            res.status(500).json({
                error: 'Error al obtener pronóstico diario',
                details: error.message
            });
        }
    }
};

module.exports = weatherController;
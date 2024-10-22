document.addEventListener('DOMContentLoaded', () => {
    loadWeatherData();
});

async function loadWeatherData(city = 'Járkov') {
    try {
        const response = await fetch(`/api/weather/current/${city}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del clima');
        }
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateUI(data) {
    document.querySelector('.header-h1').textContent = `${data.location.city}, ${data.location.country}`;
    document.querySelector('.temp').textContent = `${data.current.temp_c}°`;
    document.querySelector('.feels-like').textContent = `Sensación térmica ${data.current.feelslike_c}°`;

    const cloudyDiv = document.querySelector('.Cloudy');
    cloudyDiv.querySelector('img').src = data.current.condition.icon;
    cloudyDiv.querySelector('div').textContent = data.current.condition.text;
    

    const now = new Date();
    document.querySelector('.date').textContent = now.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
    

    document.querySelector('.detail-item:nth-child(1) div:last-child').textContent = `${data.current.wind_kph}km/h`;
    document.querySelector('.detail-item:nth-child(2) div:last-child').textContent = 
        `${data.forecast.hourly[0]?.chance_of_rain || 0}%`;
    document.querySelector('.detail-item:nth-child(3) div:last-child').textContent = 
        `${data.current.pressure_mb} hpa`;
    document.querySelector('.detail-item:nth-child(4) div:last-child').textContent = data.current.uv;
    

    updateHourlyForecast(data.forecast.hourly);
    

    updateDailyForecast(data.forecast.daily);
    

    updateRainChance(data.forecast.hourly);
    

    document.querySelector('.sunrise-sunset .time:first-child div').textContent = data.astronomy.sunrise;
    document.querySelector('.sunrise-sunset .time:last-child div').textContent = data.astronomy.sunset;
}

function updateHourlyForecast(hourlyData) {
    const forecastItems = document.querySelector('.forecast-items');
    forecastItems.innerHTML = hourlyData.map((hour, index) => `
        <div class="forecast-item">
            <div>${index === 0 ? 'Ahora' : hour.time}</div>
            <img src="${hour.condition.icon}" alt="${hour.condition.text}">
            <div>${hour.temp_c}°</div>
        </div>
    `).join('');
}

function updateDailyForecast(dailyData) {
    const dayForecastChart = document.querySelector('.day-forecast-chart');
    dayForecastChart.innerHTML = dailyData.map(day => `
        <div class="day-forecast-item">
            <div class="day-name">${day.day_name}</div>
            <div class="day-temp">${day.max_temp}°</div>
        </div>
    `).join('');
}

function updateRainChance(hourlyData) {
    const rainContainer = document.querySelector('.chance-of-rain');
    const existingBars = rainContainer.querySelectorAll('.chance-of-rain-bar');
    existingBars.forEach(bar => bar.remove());
    
    const rainBars = hourlyData.slice(0, 4).map(hour => `
        <div class="chance-of-rain-bar">
            <div class="time">${hour.time}</div>
            <div class="bar">
                <div class="fill" style="width: ${hour.chance_of_rain}%;"></div>
            </div>
            <div>${hour.chance_of_rain}%</div>
        </div>
    `).join('');
    
    rainContainer.querySelector('h3').insertAdjacentHTML('afterend', rainBars);
}
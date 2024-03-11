const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weatherImg = document.querySelector('.weather-img');
const coordinates = document.querySelector('.coordinates');
const temperature = document.querySelector('.temperature');
const precipitation = document.querySelector('.precipitation');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const airQualityLink = document.getElementById('airQualityLink');
const locationNotFound = document.querySelector('.location-not-found');
const weatherBody = document.querySelector('.weather-body');
const lat = document.getElementById('lat');
const long = document.getElementById('long');

async function checkWeather(city) {
  try {
    const locationResponse = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + city);
    const locationData = await locationResponse.json();

    if (locationData.results === undefined || city.toLowerCase() !== locationData.results[0].name.toLowerCase()) {
      locationNotFound.style.display = "flex";
      weatherBody.style.display = "none";
      return;
    }

    const { longitude, latitude } = locationData.results[0];

    coordinates.style.display = "flex";
    long.textContent = longitude;
    lat.textContent = latitude;
    airQualityLink.href = `air_quality.html?latitude=${latitude}&longitude=${longitude}`;

    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
      "latitude": latitude,
      "longitude": longitude,
      "current": ["temperature_2m", "precipitation_probability", "relative_humidity_2m", "wind_speed_10m"],
      "timezone": "America/Los_Angeles"
    };

    const urlParams = new URLSearchParams(params).toString();
    const apiUrl = `${url}?${urlParams}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const currentWeather = data['current'];
    locationNotFound.style.display = "none";
    weatherBody.style.display = "flex";
    temperature.innerHTML = `${currentWeather.temperature_2m}°C`;
    humidity.innerHTML = `${currentWeather.relative_humidity_2m}%`;
    windSpeed.innerHTML = `${currentWeather.wind_speed_10m}Km/H`;
    precipitation.innerHTML = `${currentWeather.precipitation_probability}%`;

    if (currentWeather.precipitation_probability <= 20) {
      weatherImg.src = "assets/clear.png";
    } else if (currentWeather.precipitation_probability <= 50) {
      weatherImg.src = "assets/cloud.png";
    } else {
      weatherImg.src = "assets/rain.png";
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    locationNotFound.style.display = "flex";
    weatherBody.style.display = "none";
  }
}

searchBtn.addEventListener('click', () => {
  if (inputBox.value === "") {
    alert("Please enter your location");
    return;
  }
  checkWeather(inputBox.value);
});

document.addEventListener("DOMContentLoaded", function() {
  const latitude = lat.textContent;
  const longitude = long.textContent;
  airQualityLink.href = `air_quality.html?latitude=${latitude}&longitude=${longitude}`;
});

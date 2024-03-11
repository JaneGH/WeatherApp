const airQualityIndex = document.querySelector('.air-quality-index');
const dust = document.querySelector('.dust');

function getQueryParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
        latitude: urlParams.get('latitude'),
        longitude: urlParams.get('longitude')
    };
}

async function fetchAirQualityData() {
    try {
        const { latitude, longitude } = getQueryParams();
        const urlAirQuality = "https://air-quality-api.open-meteo.com/v1/air-quality";

        const paramsAirQuality = {
            latitude: latitude,
            longitude: longitude,
            current: ["us_aqi", "dust"],
            timezone: "America/Los_Angeles"
        };

        const urlParamsAirQuality = new URLSearchParams(paramsAirQuality).toString();
        const apiUrlAirQuality = `${urlAirQuality}?${urlParamsAirQuality}`;

        const responseAirQuality = await fetch(apiUrlAirQuality);
        const dataAirQuality = await responseAirQuality.json();

        const currentAirQuality = dataAirQuality.current;

        airQualityIndex.textContent = currentAirQuality.us_aqi;
        dust.textContent = currentAirQuality.dust + "μg/m³";
    } catch (error) {
        console.error('Error fetching air quality data:', error);
        // Optionally, provide user feedback here
    }
}

fetchAirQualityData();

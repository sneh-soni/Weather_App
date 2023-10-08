const grantAccessCard = document.querySelector(".grant-access-card");
const loadingScreen = document.querySelector(".loadingscreen");
const weatherInfoCard = document.querySelector(".weather-info-card");
const errorScreen = document.querySelector(".error-screen");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

grantAccessCard.classList.add("hidden");
loadingScreen.classList.add("hidden");
weatherInfoCard.classList.add("hidden");
errorScreen.classList.add("hidden");

let localCoordinates;
checkLocation();

function checkLocation() {
    loadingScreen.classList.remove("hidden");
    const coordinates = sessionStorage.getItem("user-coordinates");
    if (!coordinates) {
        grantAccessCard.classList.remove("hidden");
        loadingScreen.classList.add("hidden");
        weatherInfoCard.classList.add("hidden");
        errorScreen.classList.add("hidden");
    } else {
        localCoordinates = JSON.parse(coordinates);
        fetchWeatherInfo(localCoordinates);
    }
}

async function fetchWeatherInfo(localCoordinates) {
    const { lat, lon } = localCoordinates;
    grantAccessCard.classList.add("hidden");
    loadingScreen.classList.add("hidden");
    errorScreen.classList.add("hidden");
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await res.json();
        loadingScreen.classList.add("hidden");
        weatherInfoCard.classList.remove("hidden");
        if(data?.name === undefined){
            throw new Error(err);
        }else{
            renderData(data);
        }
    } catch (err) {
        weatherInfoCard.classList.add("hidden");
        errorScreen.classList.remove("hidden");
    }
}

function renderData(data) {
    const cityName = document.querySelector("#city-name");
    const cityFlag = document.querySelector("#city-flag");
    const weatherDesc = document.querySelector("#weather-desc");
    const weatherIcon = document.querySelector("#weather-icon");
    const temperature = document.querySelector("#temperature");
    const windSpeed = document.querySelector("#windspeed");
    const humidity = document.querySelector("#humidity");
    const clouds = document.querySelector("#clouds");

    cityName.innerText = data?.name;
    cityFlag.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerText = ((data?.main?.temp) - 273.15).toFixed(1) + ` °C`;
    windSpeed.innerText = (data?.wind?.speed) + ` m/s`;
    humidity.innerText = (data?.main?.humidity) + ` %`;
    clouds.innerText = (data?.clouds?.all) + ` %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        errorScreen.classList.remove("hidden");
    }
}

async function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    await fetchWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[access-button]");
grantAccessButton.addEventListener("click", getLocation);

const searchForm = document.querySelector("[search-form]");
const searchInput = document.querySelector("[search-data]");
searchForm.addEventListener("submit", (def) => {
    def.preventDefault();
    let city = searchInput.value;
    if(city === "") return;
    fetchWeatherCity(city);
})

async function fetchWeatherCity(city){
    loadingScreen.classList.remove("hidden");
    grantAccessCard.classList.add("hidden");
    weatherInfoCard.classList.add("hidden");
    errorScreen.classList.add("hidden");
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const data = await res.json();
        loadingScreen.classList.add("hidden");
        weatherInfoCard.classList.remove("hidden");
        if(data?.name === undefined){
            throw new Error(err);
        }else{
            renderData(data);
        }
    }catch(err){
        weatherInfoCard.classList.add("hidden");
        errorScreen.classList.remove("hidden");
    }
}

const yourWeather = document.querySelector("#your-weather");
yourWeather.addEventListener("click", checkLocation);
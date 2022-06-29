

let button = $("button");
let todayWeatherEl = $("#today-weather");
let weatherForecastEl = $("#weather-forecast");
const apiKey = "083d29d9792e86f3b636dd9ed82e9c2b";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?"; 
const locBaseUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
let lat;
let lon;
let address = "new york";

function handleSubmit() {

}

function fetchWeatherData() {
    fetch(weatherBaseUrl + "lat="+ lat + "&lon=" + lon + "&appid=" + apiKey)
        .then(response => response.json())
        .then(data => console.log(data));
}

function fetchLocData() {
    fetch(locBaseUrl + address + "&limit=1&appid=" + apiKey)
        .then(response => response.json())
        .then(data => console.log(data));
}

fetchLocData();

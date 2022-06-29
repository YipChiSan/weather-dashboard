let button = $("button");
let todayWeatherEl = $("#today-weather");
let weatherForecastEl = $("#weather-forecast");
const apiKey = "083d29d9792e86f3b636dd9ed82e9c2b";
const baseUrl = "https://api.openweathermap.org/data/2.5/onecall?"; 
let lat = "33.44";
let lon = "-94.04";

function handleSubmit() {

}

function fetchData() {
    fetch(baseUrl + "lat="+ lat + "&lon=" + lon + "&appid=" + apiKey)
        .then(response => response.json())
        .then(data => console.log(data));
}

fetchData();
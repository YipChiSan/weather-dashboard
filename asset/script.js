let lat;
let lon;
let address;
let searchHistory = $("#search-history");
let searchBarEl = $("#city-search");
let buttonEl = $("button");
let todayWeatherEl = $("#today-weather");
let weatherForecastEl = $("#weather-forecast");
const apiKey = "083d29d9792e86f3b636dd9ed82e9c2b";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/onecall?"; 
const locBaseUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
const weatherData = [];

buttonEl.click(handleSubmit);
displaySearchHistory();

function displaySearchHistory() {
    let historyList = JSON.parse(localStorage.getItem("search-history"));
    searchHistory.empty();
    if (historyList) {
        for (let historyItem of historyList) {
            let historyItemEl = $("<button type='submit' class='btn btn-secondary btn-block'>" + historyItem + "</button>");
            searchHistory.append(historyItemEl);
        }
    }
}

function handleSubmit(e) {
    e.preventDefault();
    getSearchHistory();
    displaySearchHistory();
    fetchData();
}

function getSearchHistory() {
    let curVal = searchBarEl.val();
    if (curVal) {
        address = curVal;
        let historyList = (localStorage.getItem("search-history") === null) ? [] : JSON.parse(localStorage.getItem("search-history"));

        if (!historyList.includes(curVal.toUpperCase())) {
            historyList = [...historyList, curVal.toUpperCase()];
        }
        localStorage.setItem("search-history", JSON.stringify(historyList));
    }
    searchBarEl.val("");
}

function fetchWeatherData() {
    fetch(weatherBaseUrl + "lat="+ lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric")
        .then(response => response.json())
        .then(data => handleWeatherData(data));
}

function fetchData() {
    fetch(locBaseUrl + address + "&limit=1&appid=" + apiKey)
        .then(response => response.json())
        .then(data => {
            lat = data[0].lat;
            lon = data[0].lon;
            fetchWeatherData();
        });
}

function handleWeatherData(data) {
    for (let i = 0; i < 6; i++) {
        weatherData.push({});
        weatherData[weatherData.length - 1]["date"] = moment.unix(data.daily[i].dt).utcOffset('+1000').format('D/M/YYYY');
        weatherData[weatherData.length - 1]["icon"] = data.daily[i].weather[0].icon;
        weatherData[weatherData.length - 1]["temp"] = data.daily[i].temp.day + "°C";
        weatherData[weatherData.length - 1]["wind"] = data.daily[i].wind_speed + "metre/sec";
        weatherData[weatherData.length - 1]["humidity"] = data.daily[i].humidity + "%";
        weatherData[weatherData.length - 1]["uvIndex"] = data.daily[i].uvi;
        weatherData[weatherData.length - 1]["uvIndexDesc"] = getUVIndexCollection(data.daily[i].uvi);
    }
}

function getUVIndexCollection(uvi) {
    if (uvi <= 2) {
        return "f";
    } else if (uvi <= 7) {
        return "m";
    } else {
        return 's';
    }
}

function displayTodayWeather() {

}
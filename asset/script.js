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
const locBaseUrl = "https://api.openweathermap.org/geo/1.0/direct?q=";
let weatherData = [];

buttonEl.click(handleSubmit);
displaySearchHistory();

function displaySearchHistory() {
    let historyList = JSON.parse(localStorage.getItem("search-history"));
    searchHistory.empty();
    if (historyList) {
        for (let historyItem of historyList) {
            let historyItemEl = $("<button type='submit' class='btn btn-secondary btn-block'>" + historyItem + "</button>");
            historyItemEl.click(handleClickonHistory);
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

function handleClickonHistory(e) {
    address = $(this).text();
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
}

function fetchWeatherData() {
    fetch(weatherBaseUrl + "lat="+ lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric")
        .then(response => response.json())
        .then(data => handleWeatherData(data));
}

function fetchData() {
    weatherData = [];
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
        weatherData[weatherData.length - 1]["temp"] = data.daily[i].temp.day + " °C";
        weatherData[weatherData.length - 1]["wind"] = data.daily[i].wind_speed + " metre/sec";
        weatherData[weatherData.length - 1]["humidity"] = data.daily[i].humidity + " %";
        weatherData[weatherData.length - 1]["uvIndex"] = data.daily[i].uvi;
        weatherData[weatherData.length - 1]["uvIndexDesc"] = getUVIndexCollection(data.daily[i].uvi);
    }
    displayTodayWeather();
    displayForecastWeather();
    searchBarEl.val("");
}

function getUVIndexCollection(uvi) {
    if (uvi <= 2) {
        return "green";
    } else if (uvi <= 7) {
        return "orange";
    } else {
        return 'red';
    }
}

function displayTodayWeather() {
    todayWeatherEl.empty();
    let addressHeaderEl = $('<h2>' + address + " " + weatherData[0]["date"] + "</h2>");

    let iconEl =$('<img src=http://openweathermap.org/img/wn/' + weatherData[0]["icon"] + "@2x.png" + " >");
    
    let tempEl = $('<p>Temp: ' + weatherData[0]["temp"] + "</p>");

    let windEl = $('<p>Wind: ' + weatherData[0]["wind"] + "</p>");

    let humdEl = $('<p>Humidity: ' + weatherData[0]["humidity"] + "</p>");

    let uvContainerEl = $('<div></div>');
    let uvDataEl = $('<span>' + weatherData[0]["uvIndex"] + "</span>");

    uvDataEl.css({"color": "white", "backgroundColor": weatherData[0]["uvIndexDesc"], "padding" : "5px"});

    let uvEl = $('<span>UV Index: </span>');

    uvContainerEl.append(uvEl);
    uvContainerEl.append(uvDataEl);

    todayWeatherEl.append(addressHeaderEl);
    todayWeatherEl.append(iconEl);
    todayWeatherEl.append(tempEl);
    todayWeatherEl.append(windEl);
    todayWeatherEl.append(humdEl);
    todayWeatherEl.append(uvContainerEl);

    todayWeatherEl.css({"border": "solid"});
}

function displayForecastWeather() {
    let startingIndex = 1;
    $(".forecast-item").each(function() {
        $(this).empty();
        $(this).css({"backgroundColor" : "#0000b3", "color" : "white"})
        let addressHeaderEl = $('<h2>' + weatherData[startingIndex]["date"] + "</h2>");

        let iconEl =$('<img src=http://openweathermap.org/img/wn/' + weatherData[startingIndex]["icon"] + "@2x.png" + " >");
    
        let tempEl = $('<p>Temp: ' + weatherData[startingIndex]["temp"] + "</p>");

        let windEl = $('<p>Wind: ' + weatherData[startingIndex]["wind"] + "</p>");

        let humdEl = $('<p>Humidity: ' + weatherData[startingIndex]["humidity"] + "</p>");

        $(this).append(addressHeaderEl);
        $(this).append(iconEl);
        $(this).append(tempEl);
        $(this).append(windEl);
        $(this).append(humdEl);
        startingIndex++;
    })
}
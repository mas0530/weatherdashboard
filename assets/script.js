//GLOBAL VARIABLES
const apiKeyCurrent = "6253c56c808bcdaa72af78a1a5171dde";
const oneCallAPI = "2333826092b58c3b0f9ed3b12d33f616";
const searchForm = document.querySelector("#search-form");
const searchButton = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input");
const searchList = document.querySelector("#search-list");
const currentDateEl = document.querySelector("#currentDate");
const currentTimeEl = document.querySelector("#currentTime");
const cardGroup = document.querySelector(".card-group");
const jumbotronHeading = document.querySelector(".jumbotronHeader")
const today = moment();
let city = searchInput.value.trim();
let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKeyCurrent;
//sets the current date and time
currentDateEl.textContent = today.format("dddd, MMMM, DD, YYYY");
//searches is an array containing storedSearches
let searches = [];
//searchText is the value being saved to local storage with the key searchInput.
let searchText = (searchInput.value.trim());





//FUNCTIONS

//takes searches from local storage and puts them into searchList with key: searchInput, and value: search
function renderSearches() {
    //clear searchList and update searchCountSpan
    searchList.innerHTML = "";

    //render a new button for each search
    for (let i = 0; i < searches.length; i++) {
        let city = searches[i];
        let previousSearchButton = document.createElement("button");
        previousSearchButton.textContent = city;
        previousSearchButton.setAttribute("data-index", i);
        let a = document.createElement("a");
        a.href = (oneCallAPI);
        a.appendChild(previousSearchButton);
        searchList.appendChild(a);
    };
};

//function runs when page loads
function init() {
    //gets stored searches from localStorage
    let storedSearches = JSON.parse(localStorage.getItem("searches"));
    //if searches were retrieved from local storage, update the searches array
    if (storedSearches !== null) {
        //searches is an array made up of storedSearches (searches that have been submitted to local storage)
        searches = storedSearches;
    };
    //helper function renders searches to the DOM
    renderSearches();
};

//function puts searches into searches array in local storage
function storeSearches() {
    //strigify and set key in localStorage to searches array
    localStorage.setItem("searches", JSON.stringify(searches));
};

//user inputs their search, and the search returns fetch data
function getCurrentWeather() {
    // city is made up of user input in the search box
    city = searchInput.value.trim();
    //API request URL
    currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + apiKeyCurrent;
    let todaysWeatherCard = document.querySelector("#todays-container");
    let iconContainer = document.querySelector("#conditions-icon");
    // me reaching out to openweathermap.org to get information about the city (user determined)
    fetch(currentQueryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);

            let cityName = document.createElement("h3");
            cityName.textContent = data.name;
            jumbotronHeading.appendChild(cityName);

            let lat = data.coord.lat;
            let lon = data.coord.lon;
            let oneCallQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + oneCallAPI;
            console.log(oneCallQueryURL);
            fetch(oneCallQueryURL)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    console.log(data);
                    let temperature = document.createElement("li");
                    let humidity = document.createElement("li");
                    let windSpeed = document.createElement("li");
                    let currentIcon = document.createElement("img");
                    let icon = data.current.weather[0].icon;
                    let uv = document.createElement("li");
                    temperature.textContent = "Temperature: " + data.current.temp + " °F";
                    humidity.textContent = "Humidity: " + data.current.humidity + "%";
                    windSpeed.textContent = "Wind Speed: " + data.current.wind_speed + " mph";
                    currentIcon.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png ";
                    uv.textContent = "UV index: " + data.current.uvi;
                    todaysWeatherCard.appendChild(temperature);
                    todaysWeatherCard.appendChild(humidity);
                    todaysWeatherCard.appendChild(windSpeed);
                    iconContainer.appendChild(currentIcon);
                    todaysWeatherCard.appendChild(uv);
                    getForecastWeather(data.daily)
                    // uv color coding
                    let uvIndex = data.current.uvi;
                    if (uvIndex >= 0 && uvIndex <= 2) {
                        todaysWeatherCard.classList.add("favorable");
                    } else if (uvIndex >= 3 && uvIndex <= 5) {
                        todaysWeatherCard.classList.add("moderate");
                    } else if (uvIndex >= 6 && uvIndex <= 10) {
                        todaysWeatherCard.classList.add("severe");
                    };
                });
            // --current date (moment.js())
        });
    todaysWeatherCard.innerHTML = "";
    iconContainer.innerHTML = "";
};

function getForecastWeather(dailyForecast) {

    for (let i = 0; i < 5; i++) {
        console.log(dailyForecast[i]);
        let date = new Date((dailyForecast[i].dt) * 1000).toLocaleDateString("en-US");
        let div = document.createElement("div");
        let img = document.createElement("img");
        let h5 = document.createElement("h5");
        let conditionsList = document.createElement("ul");
        let temperature = document.createElement("li");
        let humidity = document.createElement("li");
        let windSpeed = document.createElement("li");
        let uv = document.createElement("li");
        div.classList.add("card");
        img.setAttribute("src", "http://openweathermap.org/img/wn/" + dailyForecast[i].weather[0].icon + "@2x.png ");
        img.classList.add("card-img-top");
        h5.textContent = (date);
        conditionsList.classList.add("future-data-el");
        temperature.textContent = "Temperature: " + dailyForecast[i].temp.day + " °F";
        humidity.textContent = "Humidity: " + dailyForecast[i].humidity + "%";
        windSpeed.textContent = "Wind speed: " + dailyForecast[i].wind_speed + " mph";
        uv.textContent = "UV index: " + dailyForecast[i].uvi;
        div.appendChild(img);
        cardGroup.appendChild(div);
        div.appendChild(h5);
        div.appendChild(conditionsList);
        conditionsList.appendChild(temperature);
        conditionsList.appendChild(humidity);
        conditionsList.appendChild(windSpeed);
        conditionsList.appendChild(uv);

        let uvIndex = dailyForecast[i].uvi;
        if (uvIndex >= 0 && uvIndex <= 2) {
            conditionsList.classList.add("favorable");
        } else if (uvIndex >= 3 && uvIndex <= 5) {
            conditionsList.classList.add("moderate");
        } else if (uvIndex >= 6 && uvIndex <= 10) {
            conditionsList.classList.add("severe");
        };
    };
};






//PROCESSES

//make pressing enter submit the search
searchInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
    };
});

//make clicking the search button submit the search
searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    //searchText is the input trimmed of any excess white space around the input characters
    let searchText = searchInput.value.trim();
    //return from function early if search input is blank, and give alert popup with reminder for user
    if (searchText === "") {
        alert("Please enter a valid city name");
        return;
    };
    //searches array gets searchText added to the end of the searches array and returns the new length of the array
    searches.push(searchText);

    //helper function stores searches to local storage
    storeSearches();
    //helper function renders searches to the DOM
    renderSearches();
    //helper function fetches current weather data
    getCurrentWeather();
    // clearing the search box to prepare for another search
    searchInput.value = "";
});


init()
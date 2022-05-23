//Day & hour
let now = new Date();
let h2 = document.querySelector("h2");

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let hour = now.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}

let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

h2.innerHTML = `${day} ${hour}:${minute}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let weeklyForecast = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
              <div class="weather-forecast-day"><strong>${formatDay(
                forecastDay.dt
              )}</strong></div>
              <img
                src="https://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt="Overcast clouds icon"
                width="60"
              />
              <div class="weather-forecast-temperature">
                <span class="temp-max"> <strong>${Math.round(
                  forecastDay.temp.max
                )}°</strong></span>
                <span class="temp-min">${Math.round(
                  forecastDay.temp.min
                )}°</span>
              </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  weeklyForecast.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c8a6e0907a9f2de302f3030eaf713d4b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  let pressure = document.querySelector("#pressure");
  pressure.innerHTML = response.data.main.pressure;
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = Math.round(response.data.main.temp);

  getForecast(response.data.coord);
}

function showLocation(position) {
  let apiKey = "c8a6e0907a9f2de302f3030eaf713d4b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showLocation);
}

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", getCurrentLocation);

function search(city) {
  let apiKey = "c8a6e0907a9f2de302f3030eaf713d4b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function cityWeatherLookUp(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-city");
  let h1 = document.querySelector("h1");
  if (searchInput.value) {
    h1.innerHTML = `${searchInput.value}`;
  }
  search(searchInput.value);
}

let form = document.querySelector("#search-engine");
form.addEventListener("submit", cityWeatherLookUp);

//Degrees
function changeToF(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#temperature");
  let temperatureF = (celsiusTemperature * 9) / 5 + 32;
  currentTemperature.innerHTML = Math.round(temperatureF);
  degreesC.classList.remove("active");
  degreesF.classList.add("active");
}

let celsiusTemperature = null;

let degreesF = document.querySelector("#fahrenheit-degrees");
degreesF.addEventListener("click", changeToF);

function changeToC(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = celsiusTemperature;
  degreesC.classList.add("active");
  degreesF.classList.remove("active");
}

let degreesC = document.querySelector("#celcius-degrees");
degreesC.addEventListener("click", changeToC);

displayForecast();

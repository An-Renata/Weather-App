const API_KEY = "8cac06f7ab6c10287cd06a316ff84a57";
const displayHour = document.querySelector("#display-hour");
const searchInput = document.querySelector(".search-input");
const submitSearch = document.querySelector(".btn-search");
const currentCity = document.querySelector("#current-city");
const currentTemperature = document.querySelector(".current-temperature");
const tempConversionContainer = document.querySelector(".temp-conversion");
const temps = document.querySelectorAll(".temp");
const fahrenheitButton = document.querySelector(".fahrenheit");
const celsiusButton = document.querySelector(".celsius");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const btnCurrent = document.querySelector(".btn-current-location");
const containerIcon = document.querySelector(".icon-container");
const icons = document.querySelectorAll(".icons");
const description = document.querySelector(".description");
const weekday = document.querySelectorAll(".weekday");
const dayTemp = document.querySelectorAll(".day-temperature");
const nightTemp = document.querySelectorAll(".night-temperature");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let coords = {};
let isCelsius = true;

navigator.geolocation.getCurrentPosition(function (pos) {
  return (coords = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
  });
});

class App {
  constructor(currentTemp) {
    this.currentTemp = currentTemp;
  }

  async showCurrentLocation() {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
    );
    const { data } = response;
    this.renderForecastData(data.name);
  }

  _displayDate(day, hour, minutes) {
    displayHour.innerHTML = `${days[day]} ${hour}:${minutes}`;
  }

  async renderForecastData(city) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const { data } = response;
      const { country } = data.sys;
      const citydata = await axios.get(
        `https://restcountries.com/v2/alpha/${country}`
      );
      const countryName = citydata.data.name;

      const unixTimestamp = data.dt;
      const date = new Date(unixTimestamp * 1000);
      const day = date.getDay();
      const hour = date.getHours();
      const minutes = date.getMinutes();

      this.currentTemp = data.main.temp;
      const humidityLevel = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weatherIconMain = data.weather[0].main;
      const descriptionWeather = data.weather[0].description;

      this.getIcon(weatherIconMain, containerIcon, "main");
      this.forecastOtherDays(data.coord.lat, data.coord.lon);
      this._displayDate(day, hour, minutes < 10 ? `0${minutes}` : minutes);

      description.innerHTML =
        descriptionWeather[0].toUpperCase() + descriptionWeather.slice(1);
      currentCity.innerHTML = `${data.name}, ${countryName}`;
      currentTemperature.innerHTML = `${Math.round(this.currentTemp)}°C`;
      wind.innerHTML = `${windSpeed.toFixed()}m/s`;
      humidity.innerHTML = `${humidityLevel.toFixed()}%`;
    } catch (err) {
      console.log(err);
    }
  }

  async forecastOtherDays(lat, lon) {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const { data } = response;

    const forecastData = data.list;

    const fiveDayForecast = forecastData
      .filter((_, i) => i % 8 === 0)
      .map((day) => {
        const currTemp = Math.round(day.main.temp);
        const weather = day.weather[0].main;
        const minTemp = Math.round(day.main.temp_min);
        const date = new Date(day.dt * 1000);
        const weekdayName = date.toLocaleString("default", {
          weekday: "short",
        });
        return { currTemp, weekdayName, weather, minTemp };
      });

    fiveDayForecast.forEach((day, i) => {
      dayTemp[i].innerHTML = `${day.currTemp}°`;
      nightTemp[i].innerHTML = `${day.minTemp}°`;
      weekday[i].innerHTML = day.weekdayName;
      this.getIcon(day.weather, icons[i], "small");
    });
  }

  convertToFahrenheit(celsius) {
    return Math.round(celsius * 1.8 + 32);
  }

  convertTemperature(e) {
    const clicked = e.target.closest(".temp");

    if (!clicked) return;

    temps.forEach((el) => el.classList.remove("active"));
    clicked.classList.add("active");

    if (clicked.classList.contains("fahrenheit") && isCelsius) {
      currentTemperature.innerHTML = `${this.convertToFahrenheit(
        this.currentTemp.toFixed()
      )}°F`;
      isCelsius = false;
    } else if (clicked.classList.contains("celsius") && !isCelsius) {
      currentTemperature.innerHTML = `${this.currentTemp.toFixed()}°C`;
      isCelsius = true;
    }
  }

  getIcon(weather, attr, icon) {
    switch (weather) {
      case "Clouds":
        attr.innerHTML = `<img
            src="images/Clouds.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Clear":
        attr.innerHTML = `<img
            src="images/sunny.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Snow":
        attr.innerHTML = `<img
            src="images/cloudy_with_heavy_snow.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Rain":
        attr.innerHTML = `<img
            src="images/heavy_rain.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Drizzle":
        attr.innerHTML = `<img
            src="images/light_rain.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Thunderstorm":
        attr.innerHTML = `<img
            src="images/thunderstorms.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Mist":
        attr.innerHTML = `<img
            src="images/mist.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Shower rain":
        attr.innerHTML = `<img
            src="images/cloudy_heavy_rain.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      case "Broken clouds":
      case "Scattered clouds":
      case "Few clouds":
        attr.innerHTML = `<img
            src="images/sunny_intervals.svg"
            class="${icon}-icon align-self-star"
          />
        `;
        break;
      default:
        attr.innerHTML = `<img
            src="images/sunny_intervals.svg"
            class="${icon}-icon align-self-star"
          />
        `;
    }
  }
}

const app = new App();

submitSearch.addEventListener("click", function (e) {
  e.preventDefault();
  const city = searchInput.value;
  app.renderForecastData(city);
  searchInput.value = "";
  fahrenheitButton.classList.remove("active");
  celsiusButton.classList.add("active");
});

btnCurrent.addEventListener("click", function (e) {
  e.preventDefault();
  app.showCurrentLocation();
  fahrenheitButton.classList.remove("active");
  celsiusButton.classList.add("active");
});

tempConversionContainer.addEventListener("click", function (e) {
  e.preventDefault();
  app.convertTemperature(e);
});

window.addEventListener("load", () => {
  app.showCurrentLocation();
});

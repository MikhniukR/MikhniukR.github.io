function updateMainCityWeather(weatherData) {
	document.getElementsByClassName("main_city_name")[0].textContent = weatherData.name;
	document.getElementsByClassName("main_city_temperature")[0].textContent = ~~weatherData.main.temp + "°C";
	document.getElementById("weather_image_img").src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
	document.getElementById("wind").textContent = `${weatherData.wind.speed}  m/s`;
	document.getElementById("cloudCover").textContent = `${weatherData.weather[0].description}`;
	document.getElementById("pressure").textContent = `${weatherData.main.pressure}  hpa`;
	document.getElementById("humidity").textContent = `${weatherData.main.humidity}  %`;
	document.getElementById("coordinates").textContent = `[${weatherData.coord.lon}, ${weatherData.coord.lat}]`;
}

function updateGeo(latitude, longitude) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
	xhr.send();
	xhr.onload = function() {
		weatherData = JSON.parse(xhr.response);
		updateMainCityWeather(weatherData);
	}
}

function updateMainGeo(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	updateGeo(latitude, longitude);
}

function errorHandlerForGetPosition(err) {
	updateGeo(53.9, 27.5667);
}

function loadMainCity() {
	navigator.geolocation.getCurrentPosition(updateMainGeo, errorHandlerForGetPosition);
}

function setReloadPage() {
	document.getElementsByClassName("main_city_name")[0].textContent = '???';
	document.getElementsByClassName("main_city_temperature")[0].textContent = '???';
	document.getElementById("weather_image_img").src = `images/penguin.png`;
	document.getElementById("wind").textContent = '???';
	document.getElementById("cloudCover").textContent = '???';
	document.getElementById("pressure").textContent = '???';
	document.getElementById("humidity").textContent = '???';
	document.getElementById("coordinates").textContent = '???';
}

function reloadMainCity() {
	loadMainCity();
	setReloadPage();
}


window.addEventListener('load', () => {
    loadMainCity(); 
    loadFavorites();
	let updateGeoButton = document.getElementById("update_geo_button");
	updateGeoButton.addEventListener("click", () => reloadMainCity());
});

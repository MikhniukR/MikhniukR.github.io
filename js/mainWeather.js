const API_KEY = "18c033e445ea591aedd6271d3b432f4a"

function updateMainCityWeather(weatherData) {
	document.getElementsByClassName("main_city_name")[0].innerHTML = weatherData.name;
	document.getElementsByClassName("main_city_temperature")[0].innerHTML = weatherData.main.temp + "°C";
	document.getElementsByClassName("weather_image")[0].innerHTML = `<img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" width=100 height=100></img>`;
	document.getElementsByClassName("weather_parametrs")[0].innerHTML = `
			<li><span class = "parametr">Ветер</span> ${weatherData.wind.speed} m/s</li>
			<li><span class = "parametr">Облачность</span> ${weatherData.weather[0].description}</li>
			<li><span class = "parametr">Давление</span> ${weatherData.main.pressure} hpa</li>
			<li><span class = "parametr">Влажность</span> ${weatherData.main.humidity} %</li>
			<li><span class = "parametr">Координаты</span> [${weatherData.coord.lon}, ${weatherData.coord.lat}]</li>`
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
	var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    updateGeo(latitude, longitude);
}

function errorHandlerForGetPosition(err) {
	updateGeo(53.9, 27.5667);
}


function main() {
	navigator.geolocation.getCurrentPosition(updateMainGeo, errorHandlerForGetPosition);
}
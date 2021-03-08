function removeCityFromFavorite(buttonId) {
	document.getElementById(buttonId + "li").style.display = "none"; 

	var favorites = JSON.parse(localStorage.getItem("favorites"));
	for(var i = 0; i < favorites.length; i++) {
		if (favorites[i] == buttonId) {
			favorites.splice(i, 1);
			break;
		}
	}
	localStorage.setItem("favorites", JSON.stringify(favorites));
}

function clearFavoriteCityInpit() {
	document.getElementById('add_city_input').value = '';
}

function addCityToPage(weatherData) {
	var ul = document.getElementById("favorites_cities");
	var li = document.createElement("li");
	li.setAttribute("id", weatherData.name + "li");
	li.setAttribute("class", "favorite_city");
	li.innerHTML = `<div class="favorite_city_name">
					<h3>${weatherData.name}</h3>
				</div>
				<div class="favorite_city_temperature">
					<span>${~~weatherData.main.temp}°C</span>
				</div>
				<div class="favorite_city_image">
					<img src="https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" width=50 height=50></img>
				</div>
				<div class="favorite_city_close">
					<button class="round_button" id = "${weatherData.name}" onClick = "removeCityFromFavorite(this.id);">X</button>
				</div>
				<ul class="favorite_city_parametrs">
					<li><span class = "parametr">Ветер</span> ${weatherData.wind.speed} m/s</li>
					<li><span class = "parametr">Облачность</span> ${weatherData.weather[0].description}</li>
					<li><span class = "parametr">Давление</span> ${weatherData.main.pressure} hpa</li>
					<li><span class = "parametr">Влажность</span> ${weatherData.main.humidity} %</li>
					<li><span class = "parametr">Координаты</span> [${weatherData.coord.lon}, ${weatherData.coord.lat}]</li>
				</ul>`
	ul.appendChild(li);
}

function loadFavoriteCity(name) {
	clearFavoriteCityInpit();
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`);
	xhr.send();
	xhr.onload = function() {
		weatherData = JSON.parse(xhr.response);
		addCityToPage(weatherData);
	}
}

function saveCityToStorage(name) {
	var favorites = JSON.parse(localStorage.getItem("favorites"));
	if (favorites === null) {
		favorites = []
	}
	favorites.push(name);
	localStorage.setItem("favorites", JSON.stringify(favorites));

}

function chechIsNewCity(name) {
	var favorites = JSON.parse(localStorage.getItem("favorites"));
	if (favorites === null)
		return true;
	for (var i = 0; i < favorites.length; i++) {
		if (favorites[i] == name) {
			return false;
		}
	} 
	return true;
}

function addNewCityToFavorite() {
	var name = document.getElementById('add_city_input').value;
	clearFavoriteCityInpit();
	
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`);
	xhr.send();
	xhr.onload = function() {
		weatherData = JSON.parse(xhr.response);
		if (checkIsValidCity(xhr)) {
			if (!chechIsNewCity(weatherData.name)) {
				alert("City name " + name + " is saved to Favorites");
				return;
			}
			saveCityToStorage(weatherData.name);
			addCityToPage(weatherData);
		}
		else {
			alert("City name " + name + " is incorrect");
		}
	}
}

function checkIsValidCity(xhr) {
	if (xhr.status != 200)
		return false;
	return true;
}

function checkIsEnter() {
	if(event.key === 'Enter') {
        addNewCityToFavorite();       
    }
}

function loadFavorites() {
	var favorites = JSON.parse(localStorage.getItem("favorites"));
	if (favorites != null) {
		for(var i = 0; i < favorites.length; i++) {
			loadFavoriteCity(favorites[i], false);
		}
	}
}
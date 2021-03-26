function removeCityFromFavorite(buttonId) {
	document.getElementById(buttonId + "li").style.display = "none";

	let favorites = JSON.parse(localStorage.getItem("favorites"));
	for(let i = 0; i < favorites.length; i++) {
		if (favorites[i] === buttonId) {
			favorites.splice(i, 1);
			break;
		}
	}
	localStorage.setItem("favorites", JSON.stringify(favorites));
}

function clearFavoriteCityInput() {
	document.getElementById('add_city_input').value = '';
}

function removeLoad(loadId) {
	if(document.getElementById(loadId + "li") != null) {
		document.getElementById(loadId + "li").style.display = "none"
	}
}

function addCityToPage(weatherData, loadId) {
	removeLoad(loadId);
	let mainUl = document.getElementById("favorites_cities");
	let template = document.getElementById("favoriteCityTemplate");
	let clone = document.importNode(template.content.firstElementChild, true);
	clone.setAttribute("id", weatherData.name + "li");
	clone.getElementsByClassName("favorite_city_name_h3")[0].textContent = weatherData.name;
	clone.getElementsByClassName("favorite_city_temperature_span")[0].textContent = ~~weatherData.main.temp + "°C";
	clone.getElementsByClassName("favorite_city_image_img")[0].src = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

	clone.getElementsByClassName("windFavorite")[0].textContent = `${weatherData.wind.speed}  m/s`;
	clone.getElementsByClassName("cloudCoverFavorite")[0].textContent = `${weatherData.weather[0].description}`;
	clone.getElementsByClassName("pressureFavorite")[0].textContent = `${weatherData.main.pressure}  hpa`;
	clone.getElementsByClassName("humidityFavorite")[0].textContent = `${weatherData.main.humidity}  %`;
	clone.getElementsByClassName("coordinatesFavorite")[0].textContent = `[${weatherData.coord.lon}, ${weatherData.coord.lat}]`;

	let closeButton = clone.getElementsByClassName("round_button")[0];
	closeButton.id = weatherData.name;
	closeButton.addEventListener("click", (event) => removeCityFromFavorite(event.target.id))

	mainUl.appendChild(clone);
}

function loadFavoriteCity(name) {
	clearFavoriteCityInput();
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`);
	xhr.send();
	xhr.onload = function() {
		weatherData = JSON.parse(xhr.response);
		addCityToPage(weatherData);
	}
}

function saveCityToStorage(name) {
	let favorites = JSON.parse(localStorage.getItem("favorites"));
	if (favorites === null) {
		favorites = []
	}
	favorites.push(name);
	localStorage.setItem("favorites", JSON.stringify(favorites));

}

function checkIsNewCity(name) {
	let favorites = JSON.parse(localStorage.getItem("favorites"));
	if (favorites === null)
		return true;
	for (let i = 0; i < favorites.length; i++) {
		if (favorites[i] === name) {
			return false;
		}
	} 
	return true;
}

function addReloadFavorite(loadId) {
	let mainUl = document.getElementById("favorites_cities");
	let template = document.getElementById("favoriteCityTemplate");
	let clone = document.importNode(template.content.firstElementChild, true);
	clone.setAttribute("id", loadId + "li");
	mainUl.appendChild(clone);
}

function addNewCityToFavorite() {
	let name = document.getElementById('add_city_input').value;
	let loadId = Math.floor(Math.random() * 1000);
	addReloadFavorite(loadId);
	clearFavoriteCityInput();
	
	let xhr = new XMLHttpRequest();
	xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API_KEY}&units=metric`);
	xhr.send();
	xhr.onload = function() {
		let weatherData = JSON.parse(xhr.response);
		if (checkIsValidCity(xhr)) {
			if (!checkIsNewCity(weatherData.name)) {
				removeLoad(loadId);
				alert("City name " + name + " already added to Favorites");
				return;
			}
			saveCityToStorage(weatherData.name);
			addCityToPage(weatherData, loadId);
		}
		else {
			alert("City name " + name + " is incorrect");
			removeLoad(loadId);
		}
	}

	xhr.onerror = function () {
		removeLoad(loadId);
		alert("Sorry, our backend unavailable");
	}
	xhr.ontimeout = function () {
		removeLoad(loadId);
		alert("Sorry, our backend unavailable");
	}
}

function checkIsValidCity(xhr) {
	return xhr.status === 200;
}

function loadFavorites() {
	let favorites = JSON.parse(localStorage.getItem("favorites"));
	if (favorites != null) {
		for(let i = 0; i < favorites.length; i++) {
			loadFavoriteCity(favorites[i], false);
		}
	}
}


window.addEventListener('load', (event) => {
	let addCityForm = document.getElementById("add_city");
	addCityForm.addEventListener("submit", (event) => {
		addNewCityToFavorite();
    	event.preventDefault();
	});
});

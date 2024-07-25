let baseLocation = 'toronto';
let currentLocation = '';

let unit = 'metric';
let currentCondition = '';

const formatDate = (date) => {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    return date.toISOString().split('T')[0]
}

const getTemperature = (data) => {
    return Math.round(data.days[0].temp);
}

const getMaxTemperature = (data) => {
    return Math.round(data.days[0].tempmax);
}

const getMinTemperature = (data) => {
    return Math.round(data.days[0].tempmin);
}

const getCondition = (data) => {
    console.log(data);
    return data.days[0].conditions;
}

const displayWeather = (weather) => {
    let maxTemp = getMaxTemperature(weather);
    let avgTemp = getTemperature(weather);
    let minTemp = getMinTemperature(weather);
    let condition = getCondition(weather);
    let locationDiv = document.querySelector('.city');
    // console.log(weather.resolvedAddress);
    locationDiv.textContent = weather.resolvedAddress;
    currentLocation = weather.resolvedAddress;
    let degree = document.createTextNode('U+000B0');

    let minDiv = document.querySelector('.min');
    let maxDiv = document.querySelector('.max');
    let avgDiv = document.querySelector('.average');
    let conditionDiv = document.querySelector(".condition");
    minDiv.innerHTML = `${minTemp}&deg`;
    maxDiv.innerHTML = `${maxTemp}&deg`;
    avgDiv.innerHTML = `${avgTemp}&deg`;
    conditionDiv.textContent = condition;
    currentCondition = condition;
}

const getWeatherData = async (location) => {
    let date = new Date();
    let formattedDate = formatDate(date);
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${formattedDate}?key=PCDGMW77YDW853MW5XEZ354N7&unitGroup=${unit}`;
    let response = await fetch(url);
    let json = await response.json();
    return json;

}



const initPage = async () => {
    let location = 'toronto';
    let weatherData = await getWeatherData(location);
    displayWeather(weatherData);
    displayGIF();
}

// displayWeather(getWeatherData(baseLocation));

const submitBtn = document.querySelector('#submit-btn');
submitBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    let locationDiv = document.querySelector('#location');
    let location = locationDiv.value
    locationDiv.value = '';
    let weatherData = await getWeatherData(location);

    displayWeather(weatherData);
    displayGIF();
})

const handleUnitChange = (newUnit) => {
    if (newUnit !== unit) {
        unit = newUnit;
        changeUnit(newUnit);
    }
}

const changeUnit =  async (newUnit) => {
    let weatherData = await getWeatherData(currentLocation);
    displayWeather(weatherData);
    displayGIF();
}

const getGIF = async () => {
    console.log('the condition is', currentCondition);
    const url = `https://api.giphy.com/v1/gifs/search?api_key=lDNnf7LeKyIBfqubz8jKt3pdAyuObMCt&q=${currentCondition}&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;
    let response = await fetch(url);
    return await response.json();

}
const displayGIF = async () => {
    let result = await getGIF();
    console.log(result);
    let gif = result.data[0].images.original.url;
    let imgElement = document.querySelector(".gif");
    imgElement.src = gif;
}



initPage();
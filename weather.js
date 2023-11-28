"use strict";

// William S. Johnson, Jr | 11-26-23 | DPR214 - Working With Json Datz (Weather App)


let data;
let backDrop;
let newPlace;
let windDirection;
let formatedTime;

let deviceCity, deviceState, deviceCountry;
let resultsLocation, resultsTemp, resultsIcon, iconUrl, resultsDescription, resultsHumidity, resultsCountry;
let resultsWind, resultsFeelsLike, resultsHiTemp, resultsLowTemp, resultsWindDeg, resultsOffset;

const directions = [' North ↑ ', ' Northeast ↗ ', ' East→ ', ' Southeast ↘ ', ' South ↓ ', ' Southwest ↙ ', 'West ← ', ' Northwest ↖ '];
const searchBox = $("#search_box");
const weatherKey = "6375cb9623b6be8f4284baba9b4bb2d2"
const geoKey = "b3ff619f915d4ff0907b6c7e9c954b85"

//function to calculate the local time for location entered
function convertLocalTime(resultsOffset) {
    let time = new Date();
    let localTime = time.getTime();
    let localOffset = time.getTimezoneOffset() * 60000;
    let utc = localTime + localOffset;
    let targetTime =utc + (1000 * resultsOffset);
    formatedTime = new Date(targetTime);
    formatedTime = formatedTime.toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

//Function to Convert degrees to wind Dirction
function convertDirection(resultsWindDeg) {
    windDirection = directions[Math.round(resultsWindDeg / 45) % 8];
};


//Extract Information From weather API and Display Results
function displayResults(data) {
    //Eaxtracting Data
    resultsLocation = data.name;
    resultsCountry = data.sys.country;
    resultsTemp = data.main.temp; 
    resultsIcon = data.weather[0].icon;
    resultsDescription = data.weather[0].description;
    resultsHumidity = data.main.humidity;
    resultsWind = data.wind.speed;
    resultsFeelsLike = data.main.feels_like;
    resultsHiTemp = data.main.temp_max;
    resultsLowTemp = data.main.temp_min;
    resultsWindDeg = data.wind.deg;
    resultsOffset = data.timezone;

    //Displaying the data:
    theSite.innerText = "Weather In " + resultsLocation + ", " + resultsCountry;

    resultsTemp = resultsTemp.toFixed(1);
    degrees.innerText = resultsTemp + "°F";

    resultsFeelsLike = resultsFeelsLike.toFixed(1);
    feelsLike.innerText = "Feels Like " + resultsFeelsLike + "°F";

    resultsHiTemp = resultsHiTemp.toFixed(1);
    resultsLowTemp = resultsLowTemp.toFixed(1);
    hiLow.innerText = "Hi " + resultsHiTemp + "°F / Low " + resultsLowTemp + "°F";

    iconUrl = "https://openweathermap.org/img/wn/" + resultsIcon + "@2x.png"
    $("#weatherGraphic").attr("src", iconUrl);

    resultsDescription = resultsDescription.charAt(0).toUpperCase() + 
    resultsDescription.slice(1);
    description.innerText = resultsDescription;

    humidity.innerText = "Humidity: " + resultsHumidity + "%";
    wind.innerText = "Wind: " + resultsWind.toFixed(1) + " mph";

    convertDirection(resultsWindDeg);
    //windDeg.innerText = "Wind Direction:   " + windDirection + "  at  " + resultsWindDeg + "°";
    windDeg.innerText = `Wind Direction: ${windDirection} at ${resultsWindDeg}°`;

    convertLocalTime(resultsOffset);
    theTime.innerText = formatedTime;
};

//Using the user's input, to make a weather call
function userRequest (newPlace) {
    newPlace = newPlace.trim();
    let entryCall = "https://api.openweathermap.org/data/2.5/weather?q=" + newPlace + 
    "&units=imperial&appid=" + weatherKey;
    console.log(entryCall);
    
    backDrop = "https://source.unsplash.com/1600x900/?" + newPlace;
    console.log(backDrop);
    document.body.style.cssText+=`background-image:url(${backDrop})`;   
    
    fetch(entryCall)
    .then((response) => response.json())
    .then ((data) => displayResults(data))
};


//After page load, find user's location based on IP address
$(document).ready( () => {
    fetch("https://api.geoapify.com/v1/ipinfo?apiKey=b3ff619f915d4ff0907b6c7e9c954b85")
        .then((response) => response.json())
        .then ((data) =>     {
            const latitude = data.location.latitude;
            const longitude = data.location.longitude;
            deviceCity = data.city.name;
            deviceState = data.state.name;
            deviceCountry = data.country.iso_code;
            let deviceLocation = deviceCity + "," + deviceState + "," + deviceCountry;
                    //Setting a background, based on geolocation fetch
            backDrop = "https://source.unsplash.com/1600x900/?" + deviceLocation;
            document.body.style.cssText+=`background-image:url(${backDrop})`;

             console.log(latitude);
             console.log(longitude);
                    //Obtaining weather based on longitude & latitude, from geolocation fetch
             let positionCall= "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + weatherKey;
             console.log(positionCall);             
             fetch(positionCall)
                .then((response) => response.json())
                .then ((data) => displayResults(data))                            
    });

    //Listeners for the search button and search box
    $("#search_button").click( () => {
        if (searchBox.value !== "") {
            newPlace = searchBox.val();
            userRequest(newPlace);
        }
    });
    searchBox.on("keypress", (evt) => {
        if (evt.keyCode == 13  && searchBox.value !== "") {
            newPlace = searchBox.val();
            userRequest(newPlace);
        }
    });
});



//Example of API call using city/state:
    //https://api.openweathermap.org/data/2.5/weather?q=salisbury,nc,us&units=imperial&appid={apiKey}
//Example of API call using latitude/longitude:
    //https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=&units=imperial&appid={apikey}  
//Example of Geoapify call:
    //https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey={apiKey}
//Get All the elements into the JS file, calling by their id from html file, we have created
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

//Update all the data, day,time,month for this setting interval function which can be called every seconds, 
//will be continuously calling until interval is cleared

//creating Array for Month and day, 0-11 indxes months and 0-6 indexes days
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='82d0d898b649285a8a1e3f95c8f62e1d';
//set interval function is called in every interval , in every seconds, to update time, date,
//months... everything inside the function

setInterval(() => {
    //creating new class date in the browser
    const time = new Date();
    // formatting different values to update this class date
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();

    // if hours greater or equal 12 then PM else AM
    const ampm = hour >=12 ? 'PM' : 'AM'

    //setting time and date

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

//creating a function to call the daily API data

getWeatherData()
function getWeatherData () {
    //to grt lat and lon we need using navigator to get currrent geolocation, success call back 
    //if it is success then we will call
    navigator.geolocation.getCurrentPosition((success) => {
        //based on geolocation we get latitude and longitude
        
        let latitude = success.coords.latitude;
        let longitude = success.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
        let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    
        timezone.innerHTML = data.timezone;
        countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'

    //getting humidity pressure and windspeed from the current date
    //to get sunrise and sunset formatting using cdn.js ; moment method 
    //also copy pasted the cdn.js moment library link in the html file
        currentWeatherItemsEl.innerHTML = 
        `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
        </div>
        
        
        `;

    //For the future days temp day and night

        let otherDayForcast = ''
        data.daily.forEach((day, idx) => {
            if(idx == 0){
                currentTempEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>
                
                `
            }else{
                otherDayForcast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
               </div>
                
                `
            }
        })
    
    
        weatherForecastEl.innerHTML = otherDayForcast;
 }
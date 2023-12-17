import $ from 'jquery';
const API_KEY = "be899e3e11d8fc730a23a869188b0207";

function getWeather(location, setWeather){
    $.ajax({
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&appid=${API_KEY}&units=metric`,
        success: function (data, status) {
            setWeather(data);
        },
    })
}

export {getWeather};
import React from "react";
import $ from 'jquery';

import './Dashboard.css';
import testWeather from '../../data/weather.json';
import testRoom from '../../data/roomStatus.json';

import { formatDateTime, capitalize } from "../../utils/stringManip";
import { getLocation } from "../../utils/location";
import { getWeather } from "../../utils/dashboard/setWeather";
import getAllRoom from "../../api/getAllRoomData";

export default function Dashboard(){
    const [room,setRoom] = React.useState({
        "totalRoom": -1,
        "occupiedRoom": -1,
        "emptyRoom": -1,
        "time": undefined
    })
    const [weather,setStateWeather] = React.useState(undefined);

    const location = getLocation().split(",");

    React.useEffect(()=>{
        getWeather(location,setStateWeather);
        // setStateWeather(testWeather);

        getAllRoom().then(
            data => {
                setRoom({
                    "totalRoom": data.data.totalRoom,
                    "occupiedRoom": data.data.roomOccupied,
                    "emptyRoom": data.data.roomEmpty,
                    "time": new Date(data.data.time)
                })
            }
        )
    },[])
    let weatherSpec = undefined;
    let weatherMain = undefined;
    let weatherWind = undefined;
    if(weather){
        weatherSpec = weather.weather[0];
        weatherMain = weather.main;
        weatherWind = weather.wind;
    }
    const hour = room.time && formatDateTime(room.time.getHours());
    const minute = room.time && formatDateTime(room.time.getMinutes());
    const second = room.time && formatDateTime(room.time.getSeconds());

    const day = room.time && room.time.toDateString();

    const gradient = {
        "day": {
            "first": [219, 219, 219],
            "second": [152, 205, 255],
            'text': 'black'
        },
        "night": {
            "first": [6, 106, 255],
            "second": [74, 42, 255],
            'text': 'white'
        }
    }
    const curStyle = (hour > 8 && hour < 17)?gradient.day:gradient.night;
    const styling = {
        "backgroundImage": `linear-gradient(to left, rgb(${curStyle.first[0]},${curStyle.first[1]},${curStyle.first[2]}) , rgb(${curStyle.second[0]},${curStyle.second[1]},${curStyle.second[2]}))`,
        "color": `${curStyle.text}`
    };
    return (
        <div className="dashboard">
            <div className="room-count dash-block dash-total-rooms">
                <div className="room-count-status room-count-side">
                    <p className="dash-total">{room.totalRoom} <i className="fa-solid fa-house-signal"></i></p>
                    <p>total rooms in the Hotel</p> 
                </div>
                <div className="room-count-last room-count-side">
                    <p className="dash-total">{hour}:{minute}:{second}</p>
                    <p>Last Check: {day}</p> 
                </div>
            </div>
            <div className="room-count dash-block dash-rooms">
                <div className="dash-side-block room-count-side room-count-left">
                    <p className="dash-total">{room.occupiedRoom} <i className="fa-solid fa-house-user"></i></p>
                    <p>rooms are currently occupied</p> 
                </div>
                <div className="dash-side-block room-count-side room-count-right">
                    <p className="dash-total">{room.emptyRoom} <i className="fa-solid fa-house"></i></p>
                    <p>rooms are currently empty</p>
                </div>
            </div>
            <div className="room-count dash-block dash-temp" style={styling}>
                <div className="room-count-side dash-icon">
                    {weatherSpec!=undefined && <img src={`https://openweathermap.org/img/wn/${weatherSpec.icon}@2x.png`} alt="" className="weather-icon" />}
                    {weatherSpec!=undefined && <p>{capitalize(weatherSpec.description)}</p> }
                </div>
                <div className="room-count-side dash-main-weather">
                    {weatherMain!=undefined && <p>{weatherMain.temp}°C <i className="fa-solid fa-temperature-three-quarters"></i></p>}
                    {weatherMain!=undefined && <p>{weatherMain.pressure} hPa <i className="fa-solid fa-weight-hanging"></i></p>}
                    {weatherMain!=undefined && <p>{weatherMain.humidity}% <i className="fa-solid fa-droplet"></i></p>}
                </div>
                <div className="room-count-side dash-main-wind">
                    {weatherWind!=undefined && <p>{weatherWind.speed}m/s <i className="fa-solid fa-wind"></i></p>}
                    {weatherWind!=undefined && <p>{weatherWind.deg}° <i className="fa-solid fa-compass-drafting"></i></p>}
                </div>
            </div>
        </div>
    )
}
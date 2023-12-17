import $ from 'jquery'

import { formatStringDate } from '../utils/stringManip'

import { LINK_ROOM } from './apiLink'


function getSensorList(id) {
    return $.ajax({
        method: 'GET',
        url: `${LINK_ROOM}/sensor/${id}`,
        crossDomain: true,
        contentType: 'application/json'
    })
}
function round_tenth(num){
    return Math.round(num*100)/100;
}
function formatSensorList(id) {
    return getSensorList(id).then(
        data => {
            console.log(data.data);
            return data.data.sort(
                (a, b) => {
                    let dateA = new Date(a.time);
                    let dateB = new Date(b.time);
                    if (dateA - dateB < 0) {
                        return -1;
                    }
                    else if (dateA - dateB > 0) {
                        return 1;
                    }
                    else return 0;
                }
            )
        }

    ).then(
        arr => arr.reduce((m,d)=>{
            let time = formatStringDate(d.time);
            if(!m[time]){
                m[time] = {
                    ...d, 
                    time: time,
                    count:1
                };
                return m;
            }
            m[time].temperature +=d.temperature;
            m[time].moisture += d.moisture;
            m[time].lightLevel += d.lightLevel;
            m[time].lightStatus = d.lightStatus;
            m[time].rotorStatus = d.rotorStatus;
            m[time].fanStatus = d.fanStatus;
            m[time].count ++;
            return m;
        },{})
    ).then(
        reduced => Object.keys(reduced).map(key => {
            const item = reduced[key];
            return {
                "time": key,
                "temperature": round_tenth(item.temperature/item.count),
                "moisture": round_tenth(item.moisture/item.count),
                "lightLevel": round_tenth(item.lightLevel/item.count),
                "lightStatus": item.lightStatus,
                "rotorStatus": item.rotorStatus,
                "fanStatus": item.fanStatus
            }
        })
    )
    
}

export { formatSensorList }
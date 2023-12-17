function getLoc(locObj){
    localStorage.setItem('location', `${locObj.coords.latitude},${locObj.coords.longitude}`);
}

function getLocation(){
    navigator.geolocation.getCurrentPosition(getLoc);
    const location=localStorage.getItem('location');
    return location;
}
export {getLocation};
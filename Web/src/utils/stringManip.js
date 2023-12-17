function formatDateTime(t){
    if(t>=10){
        return String(t);
    }
    return "0" + String(t);
}
function capitalizeOne(s){
    return s.charAt(0).toUpperCase()+s.slice(1);
}
function capitalize(s){
    let sGroup = s.split(" ");
    sGroup = sGroup.map(el => capitalizeOne(el));
    return sGroup.join(" ");
}
function formatStringDate(t){
    let dateItem = new Date(t);
    let year = dateItem.getFullYear();
    let month = dateItem.getMonth();
    let date = dateItem.getDate();
    return `${date}/${month}/${year}`;
}
export {formatDateTime, capitalize, formatStringDate}


// timer
let show_time = document.getElementById('show_time');
let updateTime = function(){
    const date = new Date();

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const formatted = `${timeFormatter.format(date)} . ${dateFormatter.format(date)}`;
        show_time.textContent = formatted;
    }

updateTime()
setInterval(updateTime,60000);

//changing the day period based on time
let day_period=document.getElementById('day_period');
let time = new Date();
let hour = time.getHours();

if (5<=hour && hour<12){
    day_period.textContent= 'GOOD MORNING';
}
else if (hour>=12 && hour<17){
    day_period.textContent= 'GOOD AFTERNOON';
}
else if (17 <=hour && hour< 20){
    day_period.textContent= 'GOOD EVENING';
}
else {
    day_period.textContent= 'GOOD NIGHT';
}

function getImage (condition_code){
    
    if(hour< 20 && condition_code == 1000) return "sun.png"
    if(hour>= 20 && condition_code == 1000) return "clear.png"
    else if(hour< 20 && (condition_code == 1030 || condition_code == 1135 || condition_code == 1147)) return "foggy-day.png"
    else if(hour>= 20 && (condition_code == 1030 || condition_code == 1135 || condition_code == 1147)) return "mist-night.png"
    else if(hour< 20 && (condition_code == 1030)) return "partly-cloudy-day.png"
    else if(hour>= 20 && (condition_code == 1030)) return "partly-cloudy-night.png"
    else if(condition_code == 1006 || condition_code == 1009) return "overcast.png"
    else if(condition_code ==  1063 ||  condition_code == 1072 || condition_code == 1150 || condition_code == 1153 || condition_code == 1168|| condition_code == 1171|| condition_code == 1180|| condition_code == 1183|| condition_code == 1186|| condition_code == 1189|| condition_code == 1192|| condition_code == 1195|| condition_code == 1198|| condition_code == 1201|| condition_code == 1240|| condition_code == 1243|| condition_code == 1246) return "rain.png"
    else if(condition_code == 1066 ||  condition_code == 1114 ||  condition_code == 1210||  condition_code == 1213||  condition_code == 1216||  condition_code == 1219||  condition_code == 1222||  condition_code == 1225||  condition_code == 1255||  condition_code == 1258  ) return "snow.png"
    else if(condition_code == 1069 ||  condition_code == 1204 ||  condition_code == 1207||  condition_code == 1204  ||  condition_code == 1237||  condition_code == 1249||  condition_code == 1252||  condition_code == 1204 ||  condition_code == 1261||  condition_code == 1264   ) return "sleet.png"
    else if(condition_code == 1087 ||  condition_code == 1273 ||  condition_code == 1276 ||  condition_code == 1279 ||  condition_code == 1282  ) return "thunder.png"
    else if(condition_code == 1117) return "blizzard.png"
}

//getting data from backend 
async function getData(location){
    const port = 3001;
    const url = `https://localhost:${port}/weather?q=${encodeURIComponent(location)}`; // replace special characters in location with UTF-8 escape sequences
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch(err){
        console.log("error when getting data: ", err);
    }
}

//update ui with data 
let showData = function(data){
    if (data.error) {
            createToast(data.error.message);
    }
    else{
        const weather_icon = document.getElementsByClassName('weather_icon')[0].children[0];
        weather_icon.src = `./images/${getImage(data.current.condition.code)}`;
        const temperature_value = document.getElementsByClassName('temperature')[0].children[0];
        temperature_value.textContent = data.current.temp_c;
        const description = document.getElementsByClassName('description')[0];
        description.textContent = data.current.condition.text;
        const city = document.getElementById('city').children[1];
        city.textContent = `${data.location.name}, ${data.location.region}`;
        const humidity_value = document.getElementsByClassName('humidity_components')[0].children[1];
        humidity_value.textContent = `${data.current.humidity}%`;
        const wind_value = document.getElementsByClassName('wind_components')[0].children[1];
        wind_value.textContent = `${data.current.wind_kph} kph`;
        const cards = document.getElementsByClassName('cards')[0].children;
        for(let i=0; i<3; i++){
            let day = cards[i].children[0];
            const date = new Date(data.forecast.forecastday[i].date);
            const shortName = date.toLocaleDateString('en-US',{ weekday: 'short'});
            day.textContent = shortName;
            let image = cards[i].children[1];
            image.src = `./images/${getImage(data.forecast.forecastday[i].day.condition.code)}`;
            let max_temp = cards[i].children[2];
            max_temp.textContent = data.forecast.forecastday[i].day.maxtemp_c;
            let min_temp = cards[i].children[3];
            min_temp.textContent = data.forecast.forecastday[i].day.mintemp_c;
        }
    }
}

let notifications = document.getElementsByClassName("notifications")[0];
function createToast(text){
    const newToast = document.createElement("div");
    newToast.classList.add("toast");
    newToast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>
            <div class="content">${text}</div>
            <i class="fa-solid fa-xmark"></i>`;
    notifications.appendChild(newToast);
    setTimeout(()=>newToast.remove(), 5000);
    const exit = newToast.lastChild;
    exit.addEventListener("click",()=>{
        newToast.remove();
    });
}

//Main function when search or enter is clicked
const searchButton = document.getElementById('search_button');
const searchInput = document.getElementById('search_input');

async function main(){
    const input_text = searchInput.value;
    //check if input not empty 
    if (input_text.trim()!==''){
        try {
            const data = await getData(input_text);
            showData(data);
            searchInput.value='';
        } catch(err) {
            console.log("err when showing data ", err);
        }
    }
}

// when search is clicked or enter is hit
searchButton.onclick = main;
document.body.addEventListener('keydown',function(event){
    if (event.key === 'Enter'){
        main();
    }
});



//get user location data
const locationButton = document.getElementById('Location_button');
locationButton.onclick= function(){
    navigator.geolocation.getCurrentPosition(LocationData ,errHandler);
}

async function LocationData(position) {
    const coordinates = `${position.coords.latitude}, ${position.coords.longitude}`;
    try{
        const data = await getData(coordinates);
        showData(data);
    }catch(err){
        console.log('err: ', err);
    }
}

function errHandler(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert('permission denied');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('position unavailable');
            break;
        case error.TIMEOUT:
            alert('timeout');
            break;
        default:
            alert('Please retry in a moment')
            break;
    }
}


//images 
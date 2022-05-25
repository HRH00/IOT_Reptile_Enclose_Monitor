'use strict'

window.onload = start();

function start(){


    //fetch data and update UI on load
    getData(true);
    timeout();
    
}

    
function timeout() {
    setTimeout(function () {
    getData(false);
    
    timeout();
    }, 1000);
}

function stopLoading(){
    const loading = document.getElementById("loading");
    const dataDiv = document.getElementById("dataDiv");
    loading.style.visibility="hidden"
    loading.remove();
    dataDiv.style.visibility="visible"
}
//anonomous funciton 
function updateUI(repData,firstTime){
    const degreeStr = "°C";
    const percent = "%";
    const cm = "cm";
    
    //select UI components to uppdate their text content 
    const light = document.getElementById("lightStat");
    const them1 = document.getElementById("Thermometer1");
    const them2 = document.getElementById("Thermometer2");
    const them3 = document.getElementById("Thermometer3");
    const externalThem = document.getElementById("ExternalT");
    const hygr1 = document.getElementById("Hygrometer1");
    const hygr2 = document.getElementById("Hygrometer2"); 
    const hygr3 = document.getElementById("Hygrometer3"); 
    const externalHygo = document.getElementById("ExternalH");

    const doorStat = document.getElementById("doorStat");
    const waterDepth = document.getElementById("waterDepth");
    const ventStat = document.getElementById("ventStat");
    light.textContent=(boolToString((repData.lightOn),"light"));
    them1.textContent=(repData.Thermometer1+degreeStr);
    them2.textContent=(repData.Thermometer2+degreeStr);
    them3.textContent=(repData.Thermometer3+degreeStr);
    externalThem.textContent=(repData.ExternalThemometer1+degreeStr);

    hygr1.textContent=(repData.Hygrometer1+percent);
    hygr2.textContent=(repData.Hygrometer2+percent);
    hygr3.textContent=(repData.Hygrometer3+percent);
    externalHygo.textContent=(repData.ExternalHygrometer1+percent);
    doorStat.textContent=(boolToString((repData.DoorClosed),"door"));
    waterDepth.textContent=(repData.WaterDepth+cm);
    ventStat.textContent=(boolToString((repData.VentOn),"vent"));

    //Update img to current data
    const img = document.getElementById("liveFeed");
//    img.src = "data:image/jpeg;base64,"+repData.Image.data;
    //
    

    //hide the loading
    if (firstTime===true){
        const lightButton = document.getElementById("lightButton");
        const ventButton = document.getElementById("ventButton");
        const doorButton = document.getElementById("doorButton");
    //button event listeners

        lightButton.addEventListener("click", function(){lightButtonOnClick()});
        ventButton.addEventListener("click", function(){ventButtonOnClick()});
        doorButton.addEventListener("click", function(){doorButtonOnClick()});
        stopLoading();
    };
}

async function lightButtonOnClick(){
    const element = document.getElementById("lightStat");
    const path = "http://192.168.1.188/lightSwitch";
    const fetchPromise = fetch(path);
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        element.textContent=(boolToString((reptileData.lightOn),"light"));
    });   
}
async function doorButtonOnClick(){
    const element = document.getElementById("doorStat");
    const path = "http://192.168.1.188/doorSwitch";
    const fetchPromise = fetch(path);
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        element.textContent=(boolToString((reptileData.DoorClosed),"door"));
    });   
}
async function ventButtonOnClick(){
    const element = document.getElementById("ventStat");
    const path = "http://192.168.1.188/ventSwitch";
    const fetchPromise = fetch(path);
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        element.textContent=(boolToString((reptileData.VentOn),"vent"));
    });   
}
//create a human readable string, rather then true or false using conditional statements
function boolToString(bool,id){
    id = id+"Stat";
    if (id ==="doorStat"){
        if (bool===false){return "Open";}
        else if (bool===true){return "Closed";}
        else{return "Error";}
    }
    else if (id ==="lightStat"){
        if (bool === false){return "Light Off";}
        else if (bool === true){return "Light On";}
        else{return "Error";}
    }
    else if (id==="ventStat"){
        if (bool===false){return "Disabled";}
        else if (bool===true){return "Enabled";}
        else{return "Error";}
    }
    else{return "Error"};
}
//Fetch data from our servers API
async function getData(firstTime){
    const fetchPromise = fetch("http://192.168.1.188/getData");
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        updateUI(reptileData,firstTime);        
    });
}
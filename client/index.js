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
    }, 2000);
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
    const light = document.getElementById("light");
    const them1 = document.getElementById("Thermometer1");
    const them2 = document.getElementById("Thermometer2");
    const hygr1 = document.getElementById("Hygrometer1");
    const hygr2 = document.getElementById("Hygrometer2"); 
    const doorStat = document.getElementById("doorStat");
    const waterDepth = document.getElementById("waterDepth");
    const ventStat = document.getElementById("ventStat");
    console.log(repData);
    light.textContent=(intLightToString(repData.lightOn));
    them1.textContent=(repData.Thermometer1+degreeStr);
    them2.textContent=(repData.Thermometer2+degreeStr);
    hygr1.textContent=(repData.Hygrometer1+percent);
    hygr2.textContent=(repData.Hygrometer2+percent);
    doorStat.textContent=(boolDoorToString(repData.DoorClosed));
    waterDepth.textContent=(repData.WaterDepth+cm);
    ventStat.textContent=(boolVentToString(repData.VentOn));
    
    //button event listeners
    const ledButton = document.getElementById("lightButton");
    ledButton.addEventListener("click", lightButtonOnClick);

    //hide the loading
    if (firstTime===true){stopLoading();};

    
}



function lightButtonOnClick(){
    const light = document.getElementById("light");
    const fetchPromise = fetch("http://192.168.1.188/lightSwitch");
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        light.textContent=(intLightToString(reptileData.lightOn));
    });   
}

//create a human readable string, rather then true or false using conditional statements
function boolDoorToString(bool){
    if (bool===false){return "Open";}
    else if (bool===true){return "Closed";}
    else{return "Error";}
}
function intLightToString(int){
    console.log(int);
    if (int===0){return "Off";}
    else if (int===1){return "On";}
    else{return "Error";}
}
//create a human readable string, rather then true or false using conditional statements
function boolVentToString(bool){
    if (bool===false){return "Disabled";}
    else if (bool===true){return "Enabled";}
    else{return "Error";}
}

//Fetch data from our servers API
async function getData(firstTime){
    const fetchPromise = fetch("http://192.168.1.188/getData");
    fetchPromise.then(response => {

        return response.json();
    }).then(reptileData => {

        console.log("Request data recieved");
        //Calls the UI update only once we have recieved our fuffulled request
        updateUI(reptileData,firstTime);        
    });   
}

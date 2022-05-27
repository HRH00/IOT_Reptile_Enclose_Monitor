'use strict'

window.onload = start();//calls start on load

function start(){
    //fetch data and update UI on load
    getData(true);//gets inital data for page, and passes first load boolean for controlling loading animation
    timeout();//calls looping function to populate live data
}   
function timeout() {
    setTimeout(function () {//anonymous function
    getData(false);//false for not first load in page
    
    timeout();
    }, 1000);
}
function stopLoading(){//hides loading div element and its associated animation
    const loading = document.getElementById("loading");
    const dataDiv = document.getElementById("dataDiv");
    loading.style.visibility="hidden"
    loading.remove();
    dataDiv.style.visibility="visible"//unhides the data sections to make visable to user
}
function updateUI(repData,firstTime){
    const degreeStr = "°C";//string constants for string concats used in UI 
    const percent = "%";
    const cm = "cm";
    
    //select UI components to update their text content 
    const light = document.getElementById("lightStat");
    const them1 = document.getElementById("Thermometer1");
    const them2 = document.getElementById("Thermometer2");
    const hygr1 = document.getElementById("Hygrometer1");
    const hygr2 = document.getElementById("Hygrometer2"); 
    const externalThem = document.getElementById("ExternalT");
    const externalHygo = document.getElementById("ExternalH");
    const doorStat = document.getElementById("doorStat");
    const waterDepth = document.getElementById("waterDepth");
    const ventStat = document.getElementById("ventStat");


    //sets new data in ui components
    light.textContent=(boolToString((repData.lightOn),"light"));
    them1.textContent=(repData.Thermometer1+degreeStr);
    them2.textContent=(repData.Thermometer2+degreeStr);
    hygr1.textContent=(repData.Hygrometer1+percent);
    hygr2.textContent=(repData.Hygrometer2+percent);
    externalThem.textContent=(repData.externalThermometer+degreeStr);
    externalHygo.textContent=(repData.externalHygrometer+percent);
    doorStat.textContent=(boolToString((repData.DoorClosed),"door"));
    waterDepth.textContent=(repData.WaterDepth+cm);
    ventStat.textContent=(boolToString((repData.VentOn),"vent"));

    

    //hide the loading
    if (firstTime===true){
        //selects button elements
        const lightButton = document.getElementById("lightButton");
        const ventButton = document.getElementById("ventButton");
        const doorButton = document.getElementById("doorButton");

        //assigns button event handlers to UI
        lightButton.addEventListener("click", function(){lightButtonOnClick()});
        ventButton.addEventListener("click", function(){ventButtonOnClick()});
        doorButton.addEventListener("click", function(){doorButtonOnClick()});
        stopLoading();//runs stop loading function
    };
}

async function lightButtonOnClick(){//makes request to server
    const element = document.getElementById("lightStat");
    const path = "http://192.168.1.188/lightSwitch";
    const fetchPromise = fetch(path);
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        element.textContent=(boolToString((reptileData.lightOn),"light"));//make data human readable string
    });   
}
async function doorButtonOnClick(){//makes request to server
    const element = document.getElementById("doorStat");
    const path = "http://192.168.1.188/doorSwitch";
    const fetchPromise = fetch(path);
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fulfilled request
        element.textContent=(boolToString((reptileData.DoorClosed),"door"));
    });   
}
async function ventButtonOnClick(){//makes get request to server
    const element = document.getElementById("ventStat");
    const path = "http://192.168.1.188/ventSwitch";
    const fetchPromise = fetch(path);
    fetchPromise.then(response => {
        return response.json();
    }).then(reptileData => {
        //Calls the UI update only once we have recieved our fuffulled request
        element.textContent=(boolToString((reptileData.VentOn),"vent"));//make data human readable string
    });   
}
//create a human readable string, rather then true or false using conditional statements
//Javascript for type mismatch, common in javascript as its type agnostic
function boolToString(bool,id){//generate human readable stirng from boolean data
    id = id+"Stat";
    if (id ==="doorStat"){//for door UI component
        if (bool===false){return "Open";}
        else if (bool===true){return "Closed";}
        else{return "Error";}
    }
    else if (id ==="lightStat"){//for light UI component
        if (bool === false){return "Light Off";}
        else if (bool === true){return "Light On";}
        else{return "Error";}
    }
    else if (id==="ventStat"){//for vent ui comoonent
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
        console.log(reptileData);
        
    });
}
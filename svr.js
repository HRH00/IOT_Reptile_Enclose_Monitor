'use strict'//help with type errors, also speed optimisations for comparisons such as x===null 

//These are imported packages and librarys, it includes our custom data holding class and 3rd party packages
const fs = require('fs');//file system
const dht = require("node-dht-sensor").promises;//DHT sensors libary
const express = require('express');//Host our application on localhost 5000, we use Nginx to operte as a reverse proxy server,
//later on this can help with security among other things
const Gpio = require('pigpio').Gpio;//this communicates with the C++ pigpio library running on the pi. This is used for controlling the GPIO pins
const reptileDataClass = require('./reptileData');//our custom reptile data class


//express server - this host the applicaiton on local host
const app = express();
app.use(express.static('client'));
app.use(express.static("/client/placeHolder.jpg"));//We include static files here
app.get('/', (req,res) => {res.send('/client/index.html');});

app.get('/getData', getData);//These express html get requests are what we use to control some functions from the client side app,
app.get('/lightSwitch', lightSwitch);//normally get requests are only used to request data from the server, but I have implemented them in such a way that  
app.get('/ventSwitch', ventSwitch);//when the request is made, it runs a function to control hardware then returns the updated reptile data to the client
//this isnt very good for security, a firewall would be a good first step to preventing unauthorised users from accessing the url

app.listen(5000, () => console.log('http://localhost:5000/'));//hosts the app on local host port 5000

const reptileData = new reptileDataClass();//create an instance of the data holding class, an instance of this is used for each reptile enclosure
//later this app could be updated to monitor multiple enclosures concurrently from one raspi 
reptileData.setPins(2,3,4,17,6,23,24,9,11);//sets the pin values for the different components, stored in the reptileData class


//these functions only need to be called once when the server firsts starts
setPinsToOff();//disables connected devices including the light vent and heater
startWaterMonitor();//these both start loops which are used to update reptileData with data from the components
startMonitoring();//this function also calls the heater-thermostat function and a logging function - this stores a history of all data reading, stored in a file on server


//Funcion Definitions all called via the above 3 lines of code

function setPinsToOff(){//set all neccessary pins to off
  const heaterPin = new Gpio(reptileData.HeatPin, {mode: Gpio.OUTPUT});//pin for the heater relay
  const led = new Gpio(reptileData.LightPin, {mode: Gpio.OUTPUT});//pin for the leds lighing
  const vent = new Gpio(reptileData.VentPin, {mode: Gpio.OUTPUT});//pin for the vent relay

  heaterPin.digitalWrite(1);//disables the heater
  led.digitalWrite(0);//turns off the lights
  vent.digitalWrite(1);//disables the vent
}
function startMonitoring(){//this updates the DHT sensors and calls the heater thermostat control function - every 5 seconds
  //start of loop
  setInterval(function(){
    updateDHT1();  //updates the dht values in reptile data, with data from hardware
//    updateDHT2();
//    updateDHT3();
    controlHeater();  //controls the heater dependant on the measured temp
    saveFile();  //adds an entry to the data log stored in the /db folder on server
  },5000)  //repeats every 5 seconds
}
async function getData(req, res){//this is called when the getData html request is made, it returns the reptile data object, it returns all the member variables so later  
      res.json(reptileData);//should be altered to only return the nessessary data to save bandwith and improve responsiveness
};//the client will make several fof these a minute to keep the ui data up to date

async function lightSwitch(req,res){//this function is called the the lightswitch get request is made, it toggles the lightswitch and returns the updated repitle data
  const led = new Gpio(reptileData.LightPin, {mode: Gpio.OUTPUT});
  const lightTarget = !reptileData.lightOn;

  if (lightTarget===true){
    console.log("Turning On Light");
    let dutyCycle = 0;
    const intervalForOn = setInterval(() => {
    led.pwmWrite(dutyCycle);
    dutyCycle += 5;
    if (dutyCycle > 255) {
      clearInterval(intervalForOn);
    }
  }, 20);
}
  console.log(lightTarget)
  if (lightTarget===false){
    console.log("Turning Off Light");
    let dutyCycle = 255;
    const intervalForOff = setInterval(() => {
      led.pwmWrite(dutyCycle);
    
      if (dutyCycle <= 0) {
      clearInterval(intervalForOff);
    }
    dutyCycle -= 5;
  }, 20);

  }
  reptileData.lightOn=lightTarget;
  res.json(reptileData);
}
async function ventSwitch(req,res){
  const vent = new Gpio(reptileData.VentPin, {mode: Gpio.OUTPUT});
  const ventTarget = !reptileData.VentOn;

  if (ventTarget===true){
    console.log("Turning On Vent");
    vent.digitalWrite(0);
}

  if (ventTarget===false){
    console.log("Turning Off Vent")
    vent.digitalWrite(1);
  }
  reptileData.VentOn=ventTarget;
  res.json(reptileData);
}
async function updateDHT1(){
  dht.setMaxRetries(5);
  dht.initialize(11, reptileData.DHT1Pin);
  //this is an async call
  dht.read(11, reptileData.DHT1Pin).then(
    function(res) {
      console.log("DHT11 1 Read successfully",res.temperature+"T H:"+res.humidity);
      reptileData.Thermometer1 = res.temperature;
      reptileData.Hygrometer1 = res.humidity;

      },
    function(err) {
      console.error("Failed to read sensor data From DHT 1", err);
      reptileData.Thermometer1 = null;
      reptileData.Hygrometer1 = null;

    }
  );
}
async function updateDHT2(){
  dht.setMaxRetries(5);
  dht.initialize(11, reptileData.DHT2Pin);
  //this is an async call
  dht.read(11, 17).then(
    function(res) {
      console.log("DHT11 2 Read successfully");
      reptileData.Thermometer2 = res.temperature;
      reptileData.Hygrometer2 = res.humidity;
      },
    function(err) {
      console.error("Failed to read sensor data From DHT 2", err);
      reptileData.Thermometer2 = null;
      reptileData.Hygrometer2 = null;

    }
  );
}
async function updateDHT3(){
  dht.setMaxRetries(5);
  dht.initialize(11, reptileData.DHT3Pin);
  //this is an async call
  dht.read(11, reptileData.DHT3Pin).then(
    function(res) {
      console.log(res.temperature)
      reptileData.Thermometer3 = res.temperature;
      reptileData.Hygrometer3 = res.humidity;
      },
    function(err) {
      console.error("Failed to read sensor data From DHT 3", err);
      reptileData.Thermometer3 = null;
      reptileData.Hygrometer3 = null;

    }
  );
}
function startWaterMonitor(){
  console.log("starting water monitor");
  const MICROSECDONDS_PER_CM = 1e6/34321;//used for calculations converting two time measurements into distance
  const trigger = new Gpio(23, {mode: Gpio.OUTPUT}); //sets the trigger and echo pins
  const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
  trigger.digitalWrite(0); // Make sure trigger is low initally

  //stores function as a varliable
  const watchDistance = () => {
    let startTick;
    echo.on('alert', (level, tick) => {//runs everytime the trigger is triggered
      if (level == 1) {
        startTick = tick;//this condition is met once when the trigger is first detected
      } else {
        const endTick = tick;//stores the incrementing tick value, this is used to calulate distance later
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic // right shift operator shifts the binary representation of numbers to the right,
        //removing the underflow bits and introducing new 0s from the left
        const distanceMeasured = (diff / 2 / MICROSECDONDS_PER_CM);//2 times in milliseconds, divided by to as sounds must travel back and fourth to the target
        const distanceToBowl = 25.06;// the contant distance from the sensor to the bottom of an empty water bowl
        let heightOfWater = (distanceToBowl-distanceMeasured).toFixed(1);//calulates the depth of the water inside the bowl, rounds it to one decimal place

        if (heightOfWater <=0){heightOfWater = 0}//prevent negative -0 reading from making onto client UI
        reptileData.WaterDepth=heightOfWater;//updates reptileData object
      }
    });
  };
  watchDistance();

  trigger.trigger(10, 1);//inital Trigger
  // Trigger a distance measurement once per second
  setInterval(() => {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
  }, 3000);//runs the trigger every 3 seconds in loop
}
function controlHeater(){
  //DHT1 Will be placed ontop of the heating element
  const heaterPin= new Gpio(reptileData.HeatPin, {mode: Gpio.OUTPUT});//heater relay control pib

  //enables or disables the heater dependant on the DHT11-1 Temp, the target is to stay around 30 deg(C) - my setup stays within roughly 1 degree of target 
  if ((reptileData.Thermometer1===null)){//if the sensor fails to report reading, the heater is disabled for safety
    console.log("Temp control State = null");
    console.error("Thermometer1 is null, disabling heater")//logs to console
    heaterPin.digitalWrite(1);//turns off heater
    reptileData.heaterOn=false;//updates repitleData with new value
  }
  else if (reptileData.Thermometer1<30){//turn heater on the measurement is too cold
    console.log("Temp control State = under 30Degrees\nTurning On heater");//logging
    heaterPin.digitalWrite(0);//enables the heater
    reptileData.heaterOn=true;//updates reptileData
  }
  else if ((reptileData.Thermometer1>30)){//disables heater if temp to high
    console.log("Temp control State = over 30Degrees\nTurning Off heater");//logging
    heaterPin.digitalWrite(1);//turns off heater
    reptileData.heaterOn=false;//updates reptileData
  }
  else {//error case, this disables heater and updates reptileData if none other conditions are met - such as the value has become nan/not a number
    heaterPin.digitalWrite(1);//turns off heater
    reptileData.heaterOn=false;//updates reptileData
    console.log("Turning Off heater - bad temp reading");
    console.error("Temp control State = Error\nThermometer1 is not a number, disabling heater")//logging
  } 
}

function saveFile(){//this function updates the local dataStore on the raspberryPi later this datastore could used to allow the client to view logs/history and generate graphs
  const dbFilePath = './db/localStore.txt';//local path to database file
  const data = "\n"+Date.now()+JSON.stringify(reptileData);//concats a newline, current time and reptileData Class
  fs.appendFile(dbFilePath, data ,function(err) {//initially creates localstore file if one doesnt exist or updates the file to with new data
    if (err) {console.log(err);}//error handling
  });
}
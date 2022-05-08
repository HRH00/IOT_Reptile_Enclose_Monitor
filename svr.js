const {readFileSync, writeFileSync} = require ('fs');
const dht = require("node-dht-sensor").promises;
const express = require('express');
const Gpio = require('onoff').Gpio;
const BodyParser = require(`body-parser`);

//Import our data holding class
const reptileDataClass = require('./reptileData');
const { json } = require('express/lib/response');

//express server
const app = express();
app.use(express.static('client'));
app.use(express.static("/client/placeHolder.jpg"));
app.get('/', (req,res) => {res.send('/client/index.html');});
app.get('/getData', getData);
app.get('/lightSwitch',lightSwitch);

app.listen(5000, () => console.log('http://localhost:5000/'));





const reptileData = new reptileDataClass();
reptileData.updateAll(0,0,0,0,0,false,0,false)
updateDataFromSensors();


function updateDataFromSensors() {
  setTimeout(function () {
    updateDHTA();
    updateDHTB();
    updateDataFromSensors();
    console.log(reptileData);
  }, 2000);
}


  async function getData(req, res){
        res.json(reptileData);
  };



// You can still use the synchronous version of `read`:
async function updateDHTA(){
  dht.setMaxRetries(10);
  dht.initialize(11, 2);
  //this is an async call
  dht.read(11, 2).then(
    function(res) {
      reptileData.Thermometer1=res.temperature;
      reptileData.Hygrometer1=res.humidity;
      },
    function(err) {
      console.error("Failed to read sensor data From DHT 1", err);
    }
  );
}
async function updateDHTB(){
  dht.setMaxRetries(10);
  dht.initialize(11, 3);
  dht.read(11, 3).then(
    function(res) {
      reptileData.Thermometer2=res.temperature;
      reptileData.Hygrometer2=res.humidity;
      },
    function(err) {
      console.error("Failed to read sensor data From DHT2:", err);
    }
  );
}
//we need to do this funciton concurrently - and only update the data
//for  get request after we have published the sensor reading1 
//async function updateBothDHT(){
//  dht.read(11, 2, function(err, temperature, humidity) {
//    if (!err) {
//      reptileData.Thermometer1=temperature;
//      reptileData.Hygrometer1=humidity;
//      updateDHT2();
//      return;
//    }
//    if (err){throw console.error("Error Reading DHT1 - PIN 2");}
//  });
//}
//async function updateDHT2(){
//  dht.read(11, 3, function(err, temperature, humidity) {
//    if (!err) {
//
//    
//      reptileData.Thermometer2=temperature;
//      reptileData.Hygrometer2=humidity;
//
//      return;
//    }
//    if (err){throw console.error("Error Reading DHT1");}
//  });
//}




////Other Stuff
//this code creates 2 objects led and button, when the button is pressed, the value of led id set to 0
async function lightSwitch(req, res){
  const led = new Gpio(4, 'out');
  const currentLedValue=reptileData.lightOn;
  const newLedValue = gpioFlipSwitch(currentLedValue);
  reptileData.updateLightOn(newLedValue);
  
  led.write(newLedValue);
  res.json(reptileData);}


function gpioFlipSwitch(start){
  if (start === 0){
    return 1;
  }
  else{return 0;};
}

//Start pi-camera
//const PiCamera = require('pi-camera');
//const myCamera = new PiCamera({
//  mode: 'photo',
//  width: 640,
//  height: 480,
//  nopreview: true,
//});

//myCamera.snapDataUrl()
///  .then((result) => {
    // Your picture was captured
//    console.log('<img src="${result}">');
//  })
//  .catch((error) => {
     // Handle your error
//  });
//End pi-camera
  //const dbFilePath = './db/localStore.txt';
    //const count = readFileSync(dbFilePath, 'utf-8');
    //console.log('count', count);
    //const newCount = parseInt(count) + 1;

    //writeFileSync(dbFilePath, newCount);



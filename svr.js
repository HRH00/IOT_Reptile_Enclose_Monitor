const fs = require('fs');
const dht = require("node-dht-sensor").promises;
const express = require('express');
const Gpio = require('pigpio').Gpio;

const BodyParser = require(`body-parser`);
//import npm Webcam 
const NodeWebcam = require(`node-webcam`);
const FSWebcam = NodeWebcam.FSWebcam; //require( "node-webcam/webcams/FSWebcam" );
const opts = {
  width: 1280,
  height: 720,
  quality: 100,
  frames: 30,
  saveShots: true,
  output: "",
  device: false,
  callbackReturn: "buffer",
  verbose: false,
}
const cam = new FSWebcam( opts );
//end webcam init

//Import our data holding classc
const reptileDataClass = require('./reptileData');
const { json } = require('express/lib/response');
const { Console } = require('console');

//express server
const app = express();
app.use(express.static('client'));
app.use(express.static("/client/placeHolder.jpg"));
app.use(express.static("/client/placeHolder.jpg"));
app.get('/', (req,res) => {res.send('/client/index.html');});
//app.get('/getData', getData);
//app.get('/lightSwitch',lightSwitchB);
//app.get('/lightSwitch',lightSwitch);
app.listen(5000, () => console.log('http://localhost:5000/'));

const reptileData = new reptileDataClass();
reptileData.updateAll(false,0,0,0,0,false,0,false,null);
//startWaterMonitor();

////takeImage();
////readFile();
//
//const relaya = new Gpio(21, {mode: Gpio.OUTPUT});
////const relayb = new Gpio(16, {mode: Gpio.OUTPUT});
//
//relaya.digitalWrite(0);
//console.log("Turning on")
//setTimeout(b, 120000);
//
//
//
//function b(){
//  console.log("Turning Off")
//  relaya.digitalWrite(1);
//  }
//
////Light Control
//async function lightSwitchB(req,res){
//  const led = new Gpio(4, {mode: Gpio.OUTPUT});
//  reptileData.lightOn=!reptileData.lightOn;
//  led.pwmWrite(255);
//  if (reptileData.lightOn==true){
//    console.log("Turning On Light");
//    let dutyCycle = 0;
//    const intervalForOn = setInterval(() => {
//    led.pwmWrite(dutyCycle);
//    dutyCycle += 5;
//    if (dutyCycle > 255) {
//      clearInterval(intervalForOn);
//    }
//  }, 20);
//}
//
//  if (reptileData.lightOn==false){
//    console.log("Turning Off Light");
//    let dutyCycle = 255;
//    const intervalForOff = setInterval(() => {
//      led.pwmWrite(dutyCycle);
//    dutyCycle -= 5;
//      if (dutyCycle <= 0) {
//      clearInterval(intervalForOff);
//    }
//  }, 20);
//  }
//  res.json(reptileData);
//}
//
//
//function getLightTargetFromBool(bool){
//  if (bool === true){
//    return 255;
//  }
//  else{return 0;};
//}







//function updateDataFromSensors(){
////remove
//  setTimeout(function () {
//  //  updateDHTA();
////    updateDHTB();
//    saveFile();
//    updateDataFromSensors();
//  }, 5000);
//}
//
//async function getData(req, res){
//      res.json(reptileData);
//};

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





//global constants


//image taking and move file loop function


function takeImage(){
  NodeWebcam.capture("picture.tmp", {saveShots: false, callbackReturn: "buffer"}, function(err, data) {
    //reptileData.Image=(data);// For example use a custom write
    const datePath = "db/pastImages/Shot-"+Date.now()+".jpg";
    fs.writeFileSync(datePath, data);
    // Erase temp file created
    fs.unlinkSync("picture.tmp");
});

}


//TODO
function saveFile(){
  const dbFilePath = './db/localStore.txt';
  const data = "\nTime"+Date.now()+" - "+JSON.stringify(reptileData);
  fs.appendFile(dbFilePath, data ,function(err) {
    if (err) {console.log(err);}
  });
}
function readFile(){
  const dbFilePath = './db/localStore.txt';
  const data = fs.readFile(dbFilePath , 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    parseStringFileToObject(data);
  });
}

function parseStringFileToObject(data){
  let arrayJson = [];
  for (let i=0; i<10; i++){
    arrayJson.push({});
  }
  
  console.log(arrayJson);
  return arrayJson;
}



function startWaterMonitor(){
  const MICROSECDONDS_PER_CM = 1e6/34321;
  const trigger = new Gpio(23, {mode: Gpio.OUTPUT});
  const echo = new Gpio(24, {mode: Gpio.INPUT, alert: true});
  const waterBowlBottom  = 30//cm from sensor the bottom of the water bowl is
  trigger.digitalWrite(0); // Make sure trigger is low
  const watchDistance = () => {
    let startTick;
    echo.on('alert', (level, tick) => {
      if (level == 1) {
        startTick = tick;
      } else {
        const endTick = tick;
        const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
        const distanceMeasured = (diff / 2 / MICROSECDONDS_PER_CM);
        reptileData.WaterDepth=(waterBowlBottom-distanceMeasured).toFixed(1);
        console.log(reptileData.WaterDepth);
      }
    });
  };
  watchDistance();
  trigger.trigger(10, 1);//initail Trigger
  // Trigger a distance measurement once per second
  setInterval(() => {
    trigger.trigger(10, 1); // Set trigger high for 10 microseconds
  }, 10000);
}
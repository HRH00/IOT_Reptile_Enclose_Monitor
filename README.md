const {readFileSync, writeFileSync} = require ('fs');
let DoorClosed = false;

const express = require('express');
const app = express();
app.use(express.static('client'));
app.use(express.static("/client/placeHolder.jpg"));
app.get('/', (req,res) => {res.send('/client/index.html');});


async function getData(req, res){
    const delivery = {
        "reptileData":[
          {"Thermometer0":"15°C"},
          {"Thermometer1":"16°C"},
          {"Hygrometer0":"50%"},
          {"Hygrometer1":"60%"},
          {"LightOn":"True"},
          {"DoorClosed":"True"}
        ]
    };
    res.json(delivery);
  }

//async function postData(req, res){

//  res.json(result);
//}

app.get('/getData', getData);
//app.post('/postData', express.json(), postData);

app.listen(5000, () => console.log('http://localhost:5000/'));






////Other Stuff
//this code creates 2 objects led and button, when the button is pressed, the value of led id set to 0
//const Gpio = require('onoff').Gpio;
//const led = new Gpio(17, 'out');
//const button = new Gpio(4, 'in', 'both');
//led.writeSync(1);
//button.watch((err, value) => led.writeSync(value));
//end gpio
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
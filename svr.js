const {readFileSync, writeFileSync} = require ('fs');


const express = require('express');
const app = express();
//start gpio

//this code creates 2 objects led and button, when the button is pressed, the value of led id set to 0
const Gpio = require('onoff').Gpio;
const led = new Gpio(17, 'out');
const button = new Gpio(4, 'in', 'both');
button.watch((err, value) => led.writeSync(value));
//end gpio

app.get('/', (req,res) => {
    const dbFilePath = './db/localStore.txt';
    const count = readFileSync(dbFilePath, 'utf-8');
    console.log('count', count);
    const newCount = parseInt(count) + 1;

    writeFileSync(dbFilePath, newCount);
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel = "stylesheet" type="text/css" href='style.css' >
        <title>IOT Site</title>
    </head>
    <body>
        <h1>IOT Webs App</h1>
        <p>This page has been viewed ${newCount} Times.</p>
    </body>
    <style>
        body{
            background-color:aquamarine;
        }
    <\style>
    </html>
    `);
});

app.listen(5000, () => console.log('http://localhost:5000/'));
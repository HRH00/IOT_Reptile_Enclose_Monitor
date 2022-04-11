'use strict'

window.onload = start();

function start(){
    let data = (getData());
    console.log(data);



}

async function getData(){
    let data;
    const response = await fetch('/getData')
    .then(res => res.json())
    .then(function(response){
        data = response;
    })
    return data;
    
    //.then(() => console.log(obj))
    //let data = await response.json();
    //return data;
//    console.log(JSON.parse(response));
//
//    return(await response.json())
}

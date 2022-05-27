//this class is used to store the reptile data in a reptileData objects. module.exports is used so we can import the class inside the server file
module.exports = class reptileData {
  constructor(){
      this.lightOn = false;//contructor initiates member varaibles to appropriete values 
      
      this.Thermometer1 = null;
      this.Thermometer2 = null;
      this.Hygrometer1 = null;
      this.Hygrometer2 = null;
      this.externalThermometer = null;
      this.externalHygrometer = null;

      this.DoorClosed = true;//state of door
      this.WaterDepth = null;
      this.VentOn = false;//state of vent
      this.heaterOn = false;//state of heater
      
      this.LightPin = null;//these member variables are used to store the pin values for connected hardware for use in svr.js
      this.DHT1Pin = null;
      this.DHT2Pin = null;
      this.DHTExternalPin = null;
      this.DoorDirPin = null;
      this.DoorStepPin = null;
      this.WaterTrigPin = null; 
      this.WaterEchoPin = null; 
      this.VentPin = null;
      this.HeatPin = null;
  }
  
  setAll(L,T1,T2,H1,H2,DC,WD,VO,HO){//Allows member variables to be manually set - useful during development
      this.lightOn = L;
      this.Thermometer1 = T1;
      this.Thermometer2 = T2;
      this.Hygrometer1 = H1;
      this.Hygrometer2 = H2;
      this.DoorClosed = DC;
      this.WaterDepth = WD;
      this.VentOn = VO;
      this.heaterOn = HO;
  }
  setPins(LightPin, DHT1Pin, DHT2Pin, DHTexterPin, DoorDirPin,DoorStepPin, WaterTrigPin, WaterEchoPin, VentPin,HeatPin){//sets all the pins values, later the values could be stored in a text file, which this class could access to set the pin values
    //so users can set their own pin values without having to edit source code
      this.LightPin = LightPin;
      this.DHT1Pin = DHT1Pin;
      this.DHT2Pin = DHT2Pin;
      this.DHTExternalPin = DHTexterPin;
      this.DoorDirPin = DoorDirPin;
      this.DoorStepPin = DoorStepPin;
      this.WaterTrigPin = WaterTrigPin;
      this.WaterEchoPin = WaterEchoPin;
      this.VentPin = VentPin;
      this.HeatPin = HeatPin;
  }
  

  //these functions are used to update individual member variables for development, they are not strictly required - later all of the hardware interfacing funcions in svr.js
  //should be implemented here, to make svr.js more readable and the system easier to work on.
  updateLightOn(newValue){
      this.lightOn = newValue;
  }
  updateThermometer1(newValue){
      this.Thermometer1 = newValue;
  }
  updateThermometer2(newValue){
      this.Thermometer2 = newValue;
  }
  updateHygrometer1(newValue){
      this.Hygrometer1 = newValue;
  }
  updateHygrometer2(newValue){
      this.Hygrometer2 = newValue;
  }
  updateDoorClosed(newValue){
      this.DoorClosed = newValue;
  }
  updatewaterDepth(newValue){
      this.waterDepth = newValue;
  }
  updatventOn(newValue){
      this.VentOn = newValue;
  }
}
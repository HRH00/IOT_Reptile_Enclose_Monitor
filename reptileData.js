module.exports = class reptileData {
    constructor(){
        this.lightOn = null;
        this.Thermometer1 = null;
        this.Thermometer2 = null;
        this.Hygrometer1 = null;
        this.Hygrometer2 = null;
        this.DoorClosed = null;
        this.WaterDepth = null;
        this.VentOn = null;
    }
    updateAll(L,T1,T2,H1,H2,DC,WD,VO){
        this.lightOn = L;
        this.Thermometer1 = T1;
        this.Thermometer2 = T2;
        this.Hygrometer1 = H1;
        this.Hygrometer2 = H2;
        this.DoorClosed = DC;
        this.WaterDepth = WD;
        this.VentOn = VO;
    }
    
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
    updateventOn(newValue){
        this.VentOn = newValue;
    }

}
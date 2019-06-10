"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observer = require("node-observer");
const model_1 = require("./model");
const SerialPort = require("serialport");
//parse incoming data on every \n
const parser = new SerialPort.parsers.Readline({ delimiter: "\n", includeDelimiter: false });
let sp = undefined;
//try to connect to serial port
function tryToConnectToMicro() {
    if (process.env.SERIAL_PORT == "") {
        observer.send(this, "micro-connected");
    }
    else if (process.env.SERIAL_PORT == "auto") {
        SerialPort.list().then(ports => {
            if (ports.length > 0) {
                let portName = ports[0].comName.toString();
                sp = new SerialPort(portName, {
                    baudRate: 9600,
                    autoOpen: false
                });
                observer.subscribe(this, "update-to-micro", (who, resource) => {
                    sendUpdateToPrism(resource);
                });
                observer.send(this, "micro-connected");
                sp.open(() => console.log(`Serial port ${sp.path} open`));
                sp.pipe(parser);
            }
            else {
                observer.send(this, "micro-not-connected");
            }
        });
    }
    else {
        sp = new SerialPort(process.env.SERIAL_PORT, {
            baudRate: 9600,
            autoOpen: false
        });
        observer.subscribe(this, "update-to-micro", (who, resource) => {
            sendUpdateToPrism(resource);
        });
        observer.send(this, "micro-connected");
        sp.open(() => console.log(`Serial port ${sp.path} open`));
        sp.pipe(parser);
    }
}
exports.tryToConnectToMicro = tryToConnectToMicro;
//gets serial input and parses it
parser.on("data", data => {
    try {
        let objRx = JSON.parse(data);
        if (objRx != null) {
            updateMicroState(objRx);
        }
    }
    catch (s) {
        console.log("Error on parsing serial input");
    }
});
function updateMicroState(newData) {
    if (newData.id == "lasers-changed") {
        let nLasers = newData.newValue.length;
        for (let i = 0; i < nLasers; i++) {
            let newLaser = newData.newValue[i];
            let newWaveLength = newLaser.wL;
            model_1.microState.lasers[i].waveLength.id = `laser-${newWaveLength}-nm-waveLength`;
            model_1.microState.lasers[i].waveLength.value = newLaser.wL;
            model_1.microState.lasers[i].isOn.id = `laser-${newWaveLength}-nm-isOn`;
            model_1.microState.lasers[i].isOn.value = newLaser.isOn;
            model_1.microState.lasers[i].power.id = `laser-${newWaveLength}-nm-power`;
            model_1.microState.lasers[i].power.value = newLaser.pw;
            model_1.microState.lasers[i].isPresent.id = `laser-${newWaveLength}-nm-isPresent`;
            model_1.microState.lasers[i].isPresent.value = true;
        }
        for (let i = nLasers; i < 4; i++) {
            model_1.microState.lasers[i].waveLength.value = 0;
            model_1.microState.lasers[i].waveLength.id = `no-laser`;
            model_1.microState.lasers[i].isOn.id = `no-laser`;
            model_1.microState.lasers[i].power.id = `no-laser`;
            model_1.microState.lasers[i].isPresent.value = false;
        }
        observer.send(this, "lasers-changed");
    }
    else {
        // resource value updated
        let idEls = newData.id.split("-");
        switch (idEls[0]) {
            case "scanParams":
                if (idEls[1] == "dwellTime")
                    model_1.microState.scanParams.dwellTime.value = newData.newValue;
                else
                    model_1.microState.scanParams[idEls[1]][idEls[2]].value = newData.newValue;
                break;
            case "laser":
                model_1.microState.lasers.find(laser => laser.waveLength.value == Number(idEls[1]))[idEls[3]].value = newData.newValue;
                break;
            case "mode":
                model_1.microState.mode.value = newData.newValue;
                break;
            default:
                break;
        }
        observer.send(this, "update-to-UI", { id: newData.id, value: newData.newValue });
    }
}
function sendUpdateToPrism(res) {
    let objTx = {
        id: res.id,
        newValue: res.value
    };
    sp.write(serializeData(objTx));
    sp.write("\n");
}
function serializeData(obj) {
    return JSON.stringify(obj);
}
//# sourceMappingURL=toFromMicro.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*slider initialization*/
const lasers_1 = require("./UIparts/lasers");
/*numpad initialization*/
const numpad_1 = require("./UIparts/numpad");
/*parameters initialization*/
const scanParameteres_1 = require("./UIparts/scanParameteres");
/*drag capabilties*/
/*pinch capabilties*/
const pinch_1 = require("./drag-pinch-joystick/pinch");
/*joystick capabilties*/
/*z slider sensitivity */
const movInfo_1 = require("./drag-pinch-joystick/movInfo");
const dragObj_1 = require("./drag-pinch-joystick/dragObj");
const joystickObj_1 = require("./drag-pinch-joystick/joystickObj");
/*last item in focus*/
let lastFocus = undefined;
/*start btn  initialization */
const liveBtn = document.querySelector("#live-btn");
const captureBtn = document.querySelector("#capture-btn");
const stackBtn = document.querySelector("#stack-btn");
document.body.addEventListener("click", function (e) {
    //remove highlight border only when touching something excluding numpad and selectred parameter
    if (numpad_1.numPad.filter(numBtn => numBtn === e.target).length == 0) {
        if (e.target !== numpad_1.delBtn && e.target !== numpad_1.dotBtn)
            if (scanParameteres_1.UIparameters.filter(param => param === e.target).length == 0) {
                removeHighlithBoder();
                lastFocus = null;
            }
    }
    //set UI parameter value to 0 when empty
    scanParameteres_1.UIparameters.forEach(param => {
        if (param != lastFocus)
            if (param.value == "") {
                param.value = "0";
            }
    });
});
//adds event to slider box for slider movement and on/off button
lasers_1.laserUIBoxes.forEach(laserUIBox => {
    laserUIBox.slider.oninput = () => {
        let tempValue = laserUIBox.slider.value;
        laserUIBox.powerLabel.innerHTML = tempValue + "%";
    };
    laserUIBox.btn.addEventListener("click", () => {
        laserUIBox.isOn = !laserUIBox.isOn;
        if (laserUIBox.isOn)
            lasers_1.grayOutLaserBox(laserUIBox);
        else
            lasers_1.lightUpLaserBox(laserUIBox);
    });
});
/*store last parameters input in focus*/
scanParameteres_1.UIparameters.forEach(param => {
    param.addEventListener("click", () => {
        removeHighlithBoder();
        lastFocus = param;
        param.value = "";
        param.classList.add("highlighted");
        scanParameteres_1.sendParamChange(param);
    });
});
/*add touched num in last focus element*/
numpad_1.numPad.forEach((numBtn, i) => {
    numBtn.addEventListener("click", () => {
        if (lastFocus != null) {
            lastFocus.classList.add("highlighted");
            let lastFocusParamIndex = scanParameteres_1.UIparameters.indexOf(lastFocus);
            console.log(scanParameteres_1.limits[lastFocusParamIndex].max);
            if (Number(scanParameteres_1.UIparameters[lastFocusParamIndex].value + i) > scanParameteres_1.limits[lastFocusParamIndex].max ||
                Number(scanParameteres_1.UIparameters[lastFocusParamIndex].value + i) < scanParameteres_1.limits[lastFocusParamIndex].min) {
                lastFocus.classList.add("limit");
                setTimeout(() => lastFocus.classList.remove("limit"), 600);
            }
            else {
                lastFocus.value += i;
                scanParameteres_1.sendParamChange(lastFocus);
            }
        }
    });
});
scanParameteres_1.UIparameters.forEach(param => param.addEventListener("change", () => alert("cambiato")));
//problem
/*add dot to last focus element when dot button pressed */
numpad_1.dotBtn.addEventListener("click", () => {
    if (lastFocus !== null && lastFocus.value.slice(-1) !== "." && lastFocus.value.length != 0) {
        lastFocus.classList.add("highlighted");
        lastFocus.value += ".";
        //  sendParamChange(lastFocus);
    }
});
/*delete number to last focus element when delete button pressed */
numpad_1.delBtn.addEventListener("click", () => {
    if (lastFocus != null) {
        lastFocus.classList.add("highlighted");
        lastFocus.value = lastFocus.value.slice(0, -1); /*remove last character */
        scanParameteres_1.sendParamChange(lastFocus);
    }
});
/*add dragable capabilities*/
let dragObj = new dragObj_1.DragObj(movInfo_1.inspectArea, movInfo_1.sampleArea);
let xyMotor = new joystickObj_1.JoystickObj(movInfo_1.joyThumb, movInfo_1.joyPad);
let zMotor = new joystickObj_1.JoystickObj(movInfo_1.zThumb, movInfo_1.zSlider);
/*add pinchable capabilities*/
pinch_1.pinchInfos.forEach(info => {
    info.pinchArea.addEventListener("touchstart", pinch_1.pinchStart);
    info.pinchArea.addEventListener("touchmove", pinch_1.pinch);
    info.pinchArea.addEventListener("touchend", pinch_1.pinchEnd);
});
/*
joystickInfos.forEach(info => {
  info.area.addEventListener("touchstart", joyStart);
  info.area.addEventListener("touchmove", joyMove);
  info.area.addEventListener("touchend", joyEnd);
  info.area.addEventListener("mousedown", joyStart);
  info.area.addEventListener("mousemove", joyMove);
  info.area.addEventListener("mouseup", joyEnd);
});
*/
movInfo_1.zSensBtn.addEventListener("click", () => {
    movInfo_1.zSensBtn.innerHTML = movInfo_1.zSenses[(movInfo_1.zSenses.indexOf(movInfo_1.zSensBtn.innerHTML) + 1) % movInfo_1.zSenses.length];
});
function removeHighlithBoder() {
    scanParameteres_1.UIparameters.filter(param => param.classList.contains("highlighted")).forEach(param => param.classList.remove("highlighted"));
}
setInterval(getCurrentState, 200);
function getCurrentState() {
    fetch("/prismState/")
        .then(res => res.json())
        .then(newState => {
        newState;
        scanParameteres_1.updateLimits(newState);
        lasers_1.updateUILasers(newState);
        scanParameteres_1.updateUIParameters(newState);
    });
}
function updateUIPads() { }
//incomplete
function sendLaserData(targetWaveLength) {
    fetch(`prismState/lasers/${targetWaveLength}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({})
    });
}
//# sourceMappingURL=mainUI.js.map
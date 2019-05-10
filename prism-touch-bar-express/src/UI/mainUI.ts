/*slider initialization*/
import { laserUIBoxes, grayOutLaserBox, lightUpLaserBox, sendLaserData } from "./UIparts/lasers";
/*numpad initialization*/
import { numPad, delBtn, dotBtn } from "./UIparts/numpad";
/*parameters initialization*/
import { UIparameters, sendParamChange, limits, sendParamChangeSingle } from "./UIparts/scanParameteres";
/*joystick capabilties*/
import { SliderJoystickObj } from "./UIparts/drag-pinch-joystick/joystickObj";
/*pinch capabilties*/
import { PinchObj } from "./UIparts/drag-pinch-joystick/pinchObj";
/*z slider sensitivity */
import { zSensBtn, zSenses, zThumb, zSlider, joyThumb, inspectArea, sampleArea, joyPad } from "./UIparts/drag-pinch-joystick/movObj";
import { CircJoystickObj } from "./UIparts/drag-pinch-joystick/circJoystick";
import { setUpUpdater, getCurrentState } from "./UIupdater";

setUpUpdater();

/*last item in focus*/
let lastFocus: HTMLInputElement = undefined;

/*start btn  initialization */
const liveBtn: HTMLButtonElement = document.querySelector("#live-btn");
const captureBtn: HTMLButtonElement = document.querySelector("#capture-btn");
const stackBtn: HTMLButtonElement = document.querySelector("#stack-btn");

document.body.addEventListener("click", function(e) {
  //remove highlight border only when touching something excluding numpad and selectred parameter
  if (lastFocus != null) {
    if (numPad.filter(numBtn => numBtn === e.target).length == 0) {
      if (e.target !== delBtn && e.target !== dotBtn)
        if (UIparameters.filter(param => param === e.target).length == 0) {
          removeHighlithBoder();
          sendParamChange(lastFocus);
          lastFocus = null;
        }
    }
  }
});

//adds event to slider box for slider movement and on/off button
laserUIBoxes.forEach(laserUIBox => {
  laserUIBox.slider.oninput = () => {
    let tempValue = laserUIBox.slider.value;
    laserUIBox.powerLabel.innerHTML = tempValue + "%";
    sendLaserData(laserUIBox);
  };
  laserUIBox.btn.addEventListener("click", () => {
    laserUIBox.isOn = !laserUIBox.isOn;
    if (laserUIBox.isOn) grayOutLaserBox(laserUIBox);
    else lightUpLaserBox(laserUIBox);
    sendLaserData(laserUIBox);
  });
});

/*store last parameters input in focus*/
UIparameters.forEach(param => {
  param.addEventListener("touchstart", () => {
    removeHighlithBoder();
    lastFocus = param;
    param.value = "";
    param.classList.add("highlighted");
    //sendParamChange(param);
  });
});

/*add touched num in last focus element*/
numPad.forEach((numBtn, i) => {
  numBtn.addEventListener("click", () => {
    if (lastFocus != null) {
      lastFocus.classList.add("highlighted");
      let lastFocusParamIndex = UIparameters.indexOf(lastFocus);

      if (
        Number(UIparameters[lastFocusParamIndex].value + i) > limits[lastFocusParamIndex].max ||
        Number(UIparameters[lastFocusParamIndex].value + i) < limits[lastFocusParamIndex].min
      ) {
        lastFocus.classList.add("limit");
        setTimeout(() => lastFocus.classList.remove("limit"), 600);
      } else {
        lastFocus.value += i;
        sendParamChange(lastFocus);
      }
    }
  });
});

/*add dot to last focus element when dot button pressed */
dotBtn.addEventListener("click", () => {
  if (lastFocus !== null && lastFocus.value.slice(-1) !== "." && lastFocus.value.length != 0) {
    lastFocus.classList.add("highlighted");
    lastFocus.value += ".";
  }
});

/*delete number to last focus element when delete button pressed */
delBtn.addEventListener("click", () => {
  if (lastFocus != null) {
    lastFocus.classList.add("highlighted");
    lastFocus.value = lastFocus.value.slice(0, -1); /*remove last character */
    sendParamChange(lastFocus);
  }
});

/*add dragable capabilities*/
export const lookSurface = new PinchObj(inspectArea, sampleArea, 20);

/*add joystick capabilities*/
let zMotor = new SliderJoystickObj(zThumb, zSlider);
let xyMotor = new CircJoystickObj(joyThumb, joyPad);

zSensBtn.addEventListener("click", () => {
  zSensBtn.innerHTML = zSenses[(zSenses.indexOf(zSensBtn.innerHTML) + 1) % zSenses.length];
});

function removeHighlithBoder() {
  UIparameters.filter(param => param.classList.contains("highlighted")).forEach(param => param.classList.remove("highlighted"));
}

//setInterval(getCurrentState, 200);
getCurrentState();

lookSurface.area.addEventListener("touchmove", () => {
  UIparameters[0].value = String((lookSurface.leftRelPos * limits[0].max) / lookSurface.areaWidth);
  UIparameters[1].value = String((lookSurface.topRelPos * limits[1].max) / lookSurface.areaHeight);
  UIparameters[6].value = String((lookSurface.elWidth * limits[6].max) / lookSurface.areaWidth);
  UIparameters[7].value = String((lookSurface.elHeight * limits[7].max) / lookSurface.areaHeight);
});

lookSurface.area.addEventListener("touchend", () => {
  sendParamChangeSingle("offset/x", Number(UIparameters[0].value));
  sendParamChangeSingle("offset/y", Number(UIparameters[1].value));
  sendParamChangeSingle("range/x", Number(UIparameters[6].value));
  sendParamChangeSingle("range/y", Number(UIparameters[7].value));
});

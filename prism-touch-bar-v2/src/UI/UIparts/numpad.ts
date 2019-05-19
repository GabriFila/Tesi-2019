import { lastFocus } from "../mainUI";
import { limits } from "./limits";
import { sendPut } from "../toFromAPI";
import { offsetX, rangeX, offsetY, rangeY } from "./scanParameteres";

export const dotBtn: HTMLButtonElement = document.querySelector("#btnDot");
export const delBtn: HTMLButtonElement = document.querySelector("#btnDel");

//export const numPad = [btn0, btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9];

const tempNumPad: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".numpad-btn");
//convert numpad list to array to make filtering possible
export const numPad: HTMLButtonElement[] = [];
tempNumPad.forEach(btn => numPad.push(btn));

export function setUpNumPad() {
  numPad.forEach(numBtn => {
    numBtn.addEventListener("click", () => {
      if (lastFocus != null) {
        lastFocus.classList.add("highlighted");

        if (limits.find(limit => limit.id == lastFocus.id).check(Number(lastFocus.value) + Number(numBtn.innerHTML))) {
          lastFocus.value += Number(numBtn.innerHTML);
          adjustRange();
          sendPut(`prismState/${lastFocus.id.replace("-", "/").replace("-", "/")}`, Number(lastFocus.value));
        } else {
          lastFocus.classList.add("limit");
          setTimeout(() => lastFocus.classList.remove("limit"), 600);
        }
      }
    });
  });

  function adjustRange() {
    if (Number(offsetX.value) + Number(rangeX.value) > limits.find(limit => limit.id == offsetX.id).max) {
      rangeX.value = (limits.find(limit => limit.id == offsetX.id).max - Number(offsetX.value)).toString();
      sendPut(`prismState/scanParams/range/x`, Number(rangeX.value));
    }
    if (Number(offsetY.value) + Number(rangeY.value) > limits.find(limit => limit.id == offsetY.id).max) {
      rangeY.value = (limits.find(limit => limit.id == offsetY.id).max - Number(offsetY.value)).toString();
      sendPut(`prismState/scanParams/range/y`, Number(rangeY.value));

    }
  }

  /*Numpad events */
  //add dot to last focus element when dot button pressed
  dotBtn.addEventListener("click", () => {
    if (lastFocus !== null && lastFocus.value.slice(-1) !== "." && lastFocus.value.length != 0) {
      lastFocus.classList.add("highlighted");
      lastFocus.value += ".";
    }
  });

  //delete number to last focus element when delete button pressed
  delBtn.addEventListener("click", () => {
    if (lastFocus != null) {
      lastFocus.classList.add("highlighted");
      lastFocus.value = lastFocus.value.slice(0, -1); //remove last character
      sendPut(`prismState/${lastFocus.id.replace("-", "/").replace("-", "/")}`, Number(lastFocus.value));
    }
  });
}

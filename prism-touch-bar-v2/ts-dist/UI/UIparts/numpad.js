"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mainUI_1 = require("../mainUI");
//import { limits } from "./limits";
const scanParameteres_1 = require("./scanParameteres");
exports.dotBtn = document.querySelector("#btnDot");
exports.delBtn = document.querySelector("#btnDel");
//export const numPad = [btn0, btn1, btn2, btn3, btn4, btn5, btn6, btn7, btn8, btn9];
const tempNumPad = document.querySelectorAll(".num-btn");
//convert numpad list to array to make filtering possible
exports.numPad = [];
tempNumPad.forEach(btn => exports.numPad.push(btn));
function setUpNumPad() {
    exports.numPad.forEach(numBtn => {
        numBtn.addEventListener("click", () => {
            if (mainUI_1.lastFocus != null) {
                mainUI_1.lastFocus.classList.add("highlighted");
                scanParameteres_1.changeScanParam(mainUI_1.lastFocus.id, numPadClick(mainUI_1.lastFocus, Number(numBtn.innerHTML))); // Number(lastFocus.value) * 10 + Number(numBtn.innerHTML));
            }
        });
    });
    /*Numpad events */
    //add dot to last focus element when dot button pressed
    exports.dotBtn.addEventListener("click", () => {
        if (mainUI_1.lastFocus !== null && mainUI_1.lastFocus.value.slice(-1) !== "." && mainUI_1.lastFocus.value.length != 0) {
            mainUI_1.lastFocus.classList.add("highlighted");
            mainUI_1.lastFocus.value += ".";
        }
    });
    //delete number to last focus element when delete button pressed
    exports.delBtn.addEventListener("click", () => {
        if (mainUI_1.lastFocus != null) {
            mainUI_1.lastFocus.classList.add("highlighted");
            scanParameteres_1.changeScanParam(mainUI_1.lastFocus.id, mainUI_1.lastFocus.value.slice(0, -1));
        }
    });
}
exports.setUpNumPad = setUpNumPad;
function numPadClick(el, input) {
    if (el.value.includes("."))
        return Number(el.value + `${input}`);
    else
        return Number(el.value) * 10 + input;
}
//# sourceMappingURL=numpad.js.map
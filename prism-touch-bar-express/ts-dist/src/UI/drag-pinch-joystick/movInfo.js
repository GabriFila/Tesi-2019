"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RelPosInfo {
    constructor(top, right, bottom, left) {
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.top = top;
    }
}
class MovInfo {
    constructor(element, area) {
        this.element = element;
        this.area = area;
        this.active = false;
        this.getBorderSize();
        this.getRelPos();
    }
    get borderSize() {
        this.getBorderSize();
        return this._borderSize;
    }
    get relPos() {
        this.getRelPos();
        return this._relPos;
    }
    setRelPosTop(top) {
        this._relPos.top = top;
        translateToUI(this._relPos.left, top, this.element);
    }
    setRelPosLeft(left) {
        this._relPos.left = left;
        translateToUI(left, this._relPos.top, this.element);
    }
    getBorderSize() {
        let elStyle = window.getComputedStyle(this.element);
        let regex = /([0-9]*)px[a-zA-Z0-9_ ]*/;
        let str = elStyle.getPropertyValue("border"); //gets rid of "px" in border CSS property
        this._borderSize = Number(regex.exec(str)[1]);
    }
    getRelPos() {
        this._relPos = new RelPosInfo(this.element.getBoundingClientRect().top -
            this.element.parentElement.getBoundingClientRect().top -
            getBorderSize(this.element) -
            1, this.element.getBoundingClientRect().right -
            this.element.parentElement.getBoundingClientRect().right -
            getBorderSize(this.element) -
            1, this.element.getBoundingClientRect().bottom -
            this.element.parentElement.getBoundingClientRect().bottom -
            getBorderSize(this.element) -
            1, this.element.getBoundingClientRect().left -
            this.element.parentElement.getBoundingClientRect().left -
            getBorderSize(this.element) -
            1);
    }
}
exports.MovInfo = MovInfo;
exports.inspectArea = document.querySelector("#inspect-area-0");
exports.sampleArea = document.querySelector("#sample-area");
exports.joyPad = document.querySelector("#joystick-pad");
exports.joyThumb = document.querySelector("#joystick-thumb");
exports.zThumb = document.querySelector("#z-thumb");
exports.zSlider = document.querySelector("#z-slider");
exports.zSensBtn = document.querySelector("#z-sens-btn");
exports.zSenses = ["0.1x", "0.5x", "1x"];
function getBorderSize(el) {
    let elStyle = window.getComputedStyle(el);
    let regex = /([0-9]*)px[a-zA-Z0-9_ ]*/;
    let str = elStyle.getPropertyValue("border"); //gets rid of "px" in height CSS property
    return Number(regex.exec(str)[1]);
}
exports.getBorderSize = getBorderSize;
function getRelPos(el) {
    return new RelPosInfo(el.getBoundingClientRect().top - el.parentElement.getBoundingClientRect().top - getBorderSize(el) - 1, el.getBoundingClientRect().right - el.parentElement.getBoundingClientRect().right - getBorderSize(el) - 1, el.getBoundingClientRect().bottom - el.parentElement.getBoundingClientRect().bottom - getBorderSize(el) - 1, el.getBoundingClientRect().left - el.parentElement.getBoundingClientRect().left - getBorderSize(el) - 1);
}
exports.getRelPos = getRelPos;
function translateToUI(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}
exports.translateToUI = translateToUI;
//# sourceMappingURL=movInfo.js.map
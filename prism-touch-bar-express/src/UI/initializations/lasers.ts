class LaserUIBox {
  box: HTMLDivElement;
  waveLengthLabel: HTMLLabelElement;
  slider: HTMLInputElement;
  btn: HTMLButtonElement;
  powerLabel: HTMLLabelElement;
  isOn: boolean;
  visible: boolean;
  position: number;

  constructor(
    box: HTMLDivElement,
    waveLengthLabel: HTMLLabelElement,
    slider: HTMLInputElement,
    btn: HTMLButtonElement,
    powerLabel: HTMLLabelElement,
    visible: boolean,
    position: number
  ) {
    this.box = box;
    this.waveLengthLabel = waveLengthLabel;
    this.slider = slider;
    this.btn = btn;
    this.powerLabel = powerLabel;
    this.visible = visible;
    this.position = position;
    this.isOn = false;
  }
}

const laserBox0: HTMLDivElement = document.querySelector("#slider-box-0");
const laserBox1: HTMLDivElement = document.querySelector("#slider-box-1");
const laserBox2: HTMLDivElement = document.querySelector("#slider-box-2");
const laserBox3: HTMLDivElement = document.querySelector("#slider-box-3");

const laserPower0: HTMLLabelElement = document.querySelector("#slider-value-0");
const laserPower1: HTMLLabelElement = document.querySelector("#slider-value-1");
const laserPower2: HTMLLabelElement = document.querySelector("#slider-value-2");
const laserPower3: HTMLLabelElement = document.querySelector("#slider-value-3");

const laserSlider0: HTMLInputElement = document.querySelector("#slider-0");
const laserSlider1: HTMLInputElement = document.querySelector("#slider-1");
const laserSlider2: HTMLInputElement = document.querySelector("#slider-2");
const laserSlider3: HTMLInputElement = document.querySelector("#slider-3");

const laserOnOffBtn0: HTMLButtonElement = document.querySelector("#laser-on-off-btn-0");
const laserOnOffBtn1: HTMLButtonElement = document.querySelector("#laser-on-off-btn-1");
const laserOnOffBtn2: HTMLButtonElement = document.querySelector("#laser-on-off-btn-2");
const laserOnOffBtn3: HTMLButtonElement = document.querySelector("#laser-on-off-btn-3");

const laserWaveLength0: HTMLLabelElement = document.querySelector("#laser-type-0");
const laserWaveLength1: HTMLLabelElement = document.querySelector("#laser-type-1");
const laserWaveLength2: HTMLLabelElement = document.querySelector("#laser-type-2");
const laserWaveLength3: HTMLLabelElement = document.querySelector("#laser-type-3");

export const laserUIBoxes: LaserUIBox[] = [
  new LaserUIBox(laserBox0, laserWaveLength0, laserSlider0, laserOnOffBtn0, laserPower0, true, 0),
  new LaserUIBox(laserBox1, laserWaveLength1, laserSlider1, laserOnOffBtn1, laserPower1, true, 1),
  new LaserUIBox(laserBox2, laserWaveLength2, laserSlider2, laserOnOffBtn2, laserPower2, true, 2),
  new LaserUIBox(laserBox3, laserWaveLength3, laserSlider3, laserOnOffBtn3, laserPower3, true, 3)
];

export function grayOutLaserBox(laserBox: LaserUIBox) {
  laserBox.slider.disabled = true;
  laserBox.box.classList.add("grayed-out");
  laserBox.btn.classList.remove("laser-btn-on");
  laserBox.btn.classList.add("laser-btn-off");
}

export function lightUpLaserBox(laserBox: LaserUIBox) {
  laserBox.slider.disabled = false;
  laserBox.box.classList.remove("grayed-out");
  laserBox.btn.classList.remove("laser-btn-off");
  laserBox.btn.classList.add("laser-btn-on");
}
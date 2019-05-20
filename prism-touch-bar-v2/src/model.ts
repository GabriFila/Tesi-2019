export interface MicroState {
  scanParams: ScanParams;
  lasers: Laser[];
  mode: Resource;
  motors: XYZ;
}
export interface ScanParams {
  offset: XYZ;
  pixelNumber: XYZ;
  range: XYZ;
  dwellTime: Resource;

  [key: string]: XYZ | Resource;
}

export interface XYZ {
  x: Resource;
  y: Resource;
  z: Resource;
  [key: string]: Resource;
}

export interface Laser {
  waveLength: Resource;
  power: Resource;
  isOn: Resource;
  isPresent: Resource;
}

export let microState: MicroState = require("../resources.json");

export interface Resource {
  id: string;
  value: number | boolean | string;
  unit?: string;
  min?: number;
  max?: number;
}

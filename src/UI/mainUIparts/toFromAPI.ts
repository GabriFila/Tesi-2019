import { MicroState, Resource, Laser } from "../../model";
import { updateUILasersFromLasers, laserUIRows } from "./lasers";
import { updateUIParameters, updateLimits, limits, changeScanParam } from "./scanParameteres";
import { scanArea, adatapLookSurface } from "./scanArea";
import { updateModeBtns } from "./mode";

const source = new EventSource("/updates");

export function setUpUpdater() {
  source.addEventListener("lasers-changed", (event: any) => {
    let lasers: Laser[] = JSON.parse(event.data).lasers;
    updateUILasersFromLasers(lasers);
  });
  source.addEventListener("update", (event: any) => {
    let resource: Resource = JSON.parse(event.data).resource;
    let idEls: string[] = resource.id.split("-");
    switch (idEls[0]) {
      case "mode":
        updateModeBtns(resource.value as string);
        break;
      case "scanParams":
        changeScanParam(resource.id, resource.value as number, false);
        adatapLookSurface();

        //(document.getElementById(resource.id) as HTMLInputElement).value = resource.value.toString();
        break;
      case "laser":
        let targetLaserRow = laserUIRows.find(laserRow => laserRow.waveLength == Number(idEls[1]));

        switch (idEls[3]) {
          case "isOn":
            targetLaserRow.isOn = resource.value as boolean;
            break;
          case "power":
            targetLaserRow.power = resource.value as number;
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  });
}

export function sendPut(resource: string, newValue: string | boolean | number) {
  fetch(`/${resource}`, {
    method: "PUT",
    body: JSON.stringify({ newValue }),
    headers: {
      "Content-type": "application/json"
    }
  });
}

export function getCurrentMicroState() {
  fetch("/prismState/")
    .then(res => res.json())
    .then((newState: MicroState) => {
      updateLimits(newState.scanParams);
      updateUILasersFromLasers(newState.lasers);
      updateUIParameters(newState.scanParams);
      adatapLookSurface();
    });
}

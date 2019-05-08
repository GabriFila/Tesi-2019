"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const api_resources_1 = require("./api-resources");
const api_resources_2 = require("./api-resources");
const events_1 = require("events");
const server = express();
exports.microState = new api_resources_1.State();
exports.motors = new api_resources_2.Motors();
//setInterval(getStateFromMicroscope,5000);
getStateFromMicroscope();
//json parser middlware
server.use(bodyParser.json());
//static file to render UI on client
server.use("/public", express.static(path.join(__dirname + "/../public")));
exports.updateSender = new events_1.EventEmitter();
//routes
server.use("/prismState", require("./routes/prismState-route"));
server.use("/prismMotors", require("./routes/prismMotors-route"));
//send web app UI
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../public/views/mainUI.html"));
});
server.get("/stream", (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
    });
    exports.updateSender.on("state-updated", () => {
        //res.write(SSEdata(obj, "info"));
        SSEwrite(exports.microState, "state-updated");
    });
    function SSEwrite(input, event) {
        res.write(`data: ${JSON.stringify(input)} \n`);
        res.write(`event: ${event}\n`);
        res.write(`\n`);
    }
});
//Start server
let port = process.env.PORT || 5000;
server.listen(5000, () => console.log(`Listening from ${port}`));
function getStateFromMicroscope() {
    exports.microState.scanParams.dwellTime = 50;
    exports.microState.scanParams.offset.x.current = 200;
    exports.microState.scanParams.offset.x.max = 1000;
    exports.microState.scanParams.offset.x.min = 0;
    exports.microState.scanParams.offset.y.current = 500;
    exports.microState.scanParams.offset.y.max = 1000;
    exports.microState.scanParams.offset.y.min = 0;
    exports.microState.scanParams.offset.z.current = 500;
    exports.microState.scanParams.offset.z.max = 1000;
    exports.microState.scanParams.offset.z.min = 0;
    exports.microState.scanParams.pixelNumber.x.current = 500;
    exports.microState.scanParams.pixelNumber.x.max = 1000;
    exports.microState.scanParams.pixelNumber.x.min = 0;
    exports.microState.scanParams.pixelNumber.y.current = 500;
    exports.microState.scanParams.pixelNumber.y.max = 1000;
    exports.microState.scanParams.pixelNumber.y.min = 0;
    exports.microState.scanParams.pixelNumber.z.current = 500;
    exports.microState.scanParams.pixelNumber.z.max = 1000;
    exports.microState.scanParams.pixelNumber.z.min = 0;
    exports.microState.scanParams.range.x.current = 500;
    exports.microState.scanParams.range.x.max = 1000;
    exports.microState.scanParams.range.x.min = 0;
    exports.microState.scanParams.range.y.current = 500;
    exports.microState.scanParams.range.y.max = 1000;
    exports.microState.scanParams.range.y.min = 0;
    exports.microState.scanParams.range.z.current = 500;
    exports.microState.scanParams.range.z.max = 1000;
    exports.microState.scanParams.range.z.min = 0;
    exports.microState.lasers[0].waveLength = 300;
    exports.microState.lasers[0].isOn = true;
    exports.microState.lasers[0].power = 0;
    exports.microState.lasers[1].waveLength = 400;
    exports.microState.lasers[1].isOn = true;
    exports.microState.lasers[1].power = 10;
    exports.microState.lasers[2].waveLength = 500;
    exports.microState.lasers[2].isOn = true;
    exports.microState.lasers[2].power = 20;
    exports.microState.lasers[3].waveLength = 600;
    exports.microState.lasers[3].isOn = true;
    exports.microState.lasers[3].power = 30;
}
function sendStateToPrism() { }
//# sourceMappingURL=server.js.map
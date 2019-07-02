"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const observer = require("node-observer");
const bodyChecker_1 = require("./middlewares/bodyChecker");
const updates_route_1 = require("./middlewares/routes/updates-route");
const prismState_route_1 = require("./middlewares/routes/prismState-route");
const limitsChecker_1 = require("./middlewares/limitsChecker");
const responseSender_1 = require("./middlewares/responseSender");
const toFromMicro_1 = require("./toFromMicro");
//set right enviromment variables
if (process.argv[2] === undefined) {
    console.log("dev mode");
    dotenv.config({ path: "./variables.dev.env" });
}
else if (process.argv[2] === "prod") {
    console.log("prod mode");
    dotenv.config({ path: "./variables.prod.env" });
}
exports.server = express();
let isMicroConnected = false;
//middleware to parse body
exports.server.use(bodyParser.json());
//middleware to check if body has newValue field
exports.server.use(bodyChecker_1.bodyChecker);
//routes
exports.server.use("/prismState", prismState_route_1.prismState);
exports.server.use("/updates", updates_route_1.updates);
//middleware to check limit
exports.server.use(limitsChecker_1.limitsChecker);
//middleware to send succes response back and make necessary API updates
exports.server.use(responseSender_1.responseSender);
//static file to render UI on clients
exports.server.use("/public", express.static(path.join(__dirname + "/../../public")));
//send web app UI or connection waiting screen
exports.server.get("/", (req, res) => {
    if (isMicroConnected) {
        res.sendFile(path.join(__dirname + "/../../public/views/mainUI.html"));
    }
    else
        res.sendFile(path.join(__dirname + "/../../public/views/waitConnect.html"));
});
//keeo trying to make a connection when previous attemp failed
observer.subscribe(this, "micro-not-connected", () => {
    isMicroConnected = false;
    setTimeout(toFromMicro_1.tryToConnectToMicro, 1000);
});
//connection succeded
observer.subscribe(this, "micro-connected", () => {
    isMicroConnected = true;
});
//first attemp to connect
toFromMicro_1.tryToConnectToMicro();
//start server
let port = process.env.PORT;
exports.server.listen(port, () => console.log(`Listening from ${port}`));
//# sourceMappingURL=server.js.map
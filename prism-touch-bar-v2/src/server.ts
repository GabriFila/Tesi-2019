import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";

import { updates } from "./middlewares/routes/updates-route";
import { prismState } from "./middlewares/routes/prismState-route";

import { bodyChecker } from "./middlewares/bodyChecker";
import { limitsChecker } from "./middlewares/limitsChecker";
import { responseSender } from "./middlewares/responseSender";
import { setUpMicroCom } from "./toFromMicro";

const server = express();

//json parser middlware
server.use(bodyParser.json());
server.use(bodyChecker);

//routes
server.use("/prismState", prismState);
server.use("/updates", updates);
server.use(limitsChecker);
server.use(responseSender);

//static file to render UI on client
server.use("/public", express.static(path.join(__dirname + "/../public")));

//send web app UI
server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/views/mainUI.html"));
});

setUpMicroCom();

//Start server
let port = process.env.PORT || 5000;
server.listen(5000, () => console.log(`Listening from ${port}`));

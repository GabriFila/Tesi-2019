"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const server_1 = require("../server");
const updatePrism_1 = require("../updatePrism");
const scanParam = express.Router();
scanParam.get("/", (req, res) => {
    res.json(server_1.microState.scanParams);
});
scanParam.put("/:dim/:axis", (req, res) => {
    let errors = [];
    let dim = req.params.dim;
    let axis = req.params.axis.toLowerCase();
    let newValue;
    if (dim == "offset" || dim == "range" || dim == "pixelNumber" || dim == "offset") {
        if (axis == "x" || axis == "y" || axis == "z") {
            if ("newValue" in req.body) {
                newValue = req.body.newValue;
                if (newValue >= server_1.microState.scanParams[dim][axis].min) {
                    if (newValue <= server_1.microState.scanParams[dim][axis].max) {
                        server_1.microState.scanParams[dim][axis].current = newValue;
                    }
                    else
                        errors.push(`${newValue} for ${dim} ${axis} is higher than max value(${server_1.microState.scanParams[dim][axis].max})`);
                }
                else
                    errors.push(`${newValue} for ${dim} ${axis} is lower than min value (${server_1.microState.scanParams[dim][axis].min})`);
            }
            else
                errors.push(`newValue field not specified`);
        }
        else
            errors.push(`${axis} is not a valid axis`);
    }
    else
        errors.push(`${dim} is not a valid dimension`);
    if (errors.length > 0)
        res.status(400).json({ errors });
    else {
        res.status(200).json({ dim, axis, newValue, state: server_1.microState });
        updatePrism_1.updateEmitter.emit(`UI-updated-${dim}-${axis}`);
    }
});
scanParam.put("/:dim", (req, res) => {
    let errors = [];
    if (req.params.dim == "dwellTime") {
        if (req.body.newValue) {
            if (req.body.newValue > 0)
                server_1.microState.scanParams.dwellTime = req.body.newValue;
            else
                errors.push("time value must be positive");
        }
        else
            errors.push("no newValue field specified");
    }
    else
        errors.push(`${req.params.dim} is an invalid resource`);
    if (errors.length > 0)
        res.status(400).json({ errors });
    else {
        res.status(200).send({ newValue: req.body.newValue });
        updatePrism_1.updateEmitter.emit(`UI-updated-dwellTime`);
    }
});
module.exports = scanParam;
//# sourceMappingURL=scanParams-route.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const empcontroller_1 = __importDefault(require("./empcontroller"));
const worksheetcontroller_1 = __importDefault(require("./worksheetcontroller"));
const uploadimgcontroller_1 = __importDefault(require("./uploadimgcontroller"));
const app1 = (0, express_1.default)();
app1.use('/CRUD', empcontroller_1.default);
app1.use('/CRUD', worksheetcontroller_1.default);
app1.use('/CRUD', uploadimgcontroller_1.default);
module.exports = app1;

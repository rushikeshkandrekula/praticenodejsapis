"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./controller/api"));
const dbconnection_1 = require("./dbconnection");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Connected to" + PORT);
});
(0, dbconnection_1.mongoconn)();
app.use('/MongoDB', api_1.default);

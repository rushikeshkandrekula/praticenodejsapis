"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driverschema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const driversappschema = new mongoose_1.default.Schema({
    driverName: { type: String },
    Contact: { type: String },
    mailId: { type: String },
    badgenumber: { type: Number },
    address: { type: String },
    city: { type: String, default: "" },
});
exports.Driverschema = mongoose_1.default.model('driver', driversappschema, 'driver');

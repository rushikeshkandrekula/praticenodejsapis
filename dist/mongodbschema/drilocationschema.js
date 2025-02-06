"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverslocationschema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const drilocschema = new mongoose_1.default.Schema({
    countryID: { type: String },
    address1: { type: String },
    city: { type: String },
    stateID: { type: String }
});
exports.driverslocationschema = mongoose_1.default.model('driverloc', drilocschema, 'driverloc');

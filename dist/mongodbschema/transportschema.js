"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transportschema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const transportschema = new mongoose_1.default.Schema({
    fullName: { type: String },
    tradingName: { type: String },
    erpCode: { type: Number },
    taxID: { type: Number },
    taxNo: { type: Number },
    mobileNumber: { type: String },
    mailId: { type: String },
    countryID: { type: String },
    address1: { type: String },
    city: { type: String },
    stateID: { type: String }
});
exports.Transportschema = mongoose_1.default.model('transport', transportschema, 'transport');

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOP_MASTER_SCHEMA = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StopMaster = new mongoose_1.default.Schema({
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    lat: { type: String, default: "" },
    lng: { type: String, default: "" },
    location: { type: String, default: "" },
    coordinates: [],
    createddate: { type: Date },
    updateddate: { type: Date },
    updatedby: { type: String, default: "" },
    createdby: { type: String, default: "" },
    stoptype: { type: String, default: "" },
    stoptypedesc: { type: String, default: "" },
    clientid: { type: String, default: "" },
    isUnauthorized: { type: Boolean, default: false },
    isGeofence: { type: Boolean, default: false },
    isDetention: { type: Boolean, default: false },
    geofence: {
        lat: { type: String, default: "" },
        long: { type: String, default: "" },
        radius: { type: Number, default: 0 }
    },
    erpcode: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    speedlimit: { type: String, default: "" },
    email: { type: Array, default: [] },
    users: { type: Array, default: [] },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" }
});
exports.STOP_MASTER_SCHEMA = mongoose_1.default.model("stopmaster", StopMaster, "stopmaster");

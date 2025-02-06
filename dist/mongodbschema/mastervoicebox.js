"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MASTER_VOICE_BOX = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VoiceBox = new mongoose_1.default.Schema({
    model_id: { type: String, default: "" },
    msis_dn: { type: String, default: "" },
    model_name: { type: String, default: "" },
    model_desc: { type: String, default: "" },
    imei: { type: String, default: "" },
    jmti_id: { type: String, default: "" },
    isonboarded: { type: Boolean, default: false },
    isWhitelisted: { type: Boolean, default: false },
    access_key: { type: String, default: "" },
    model_oem: { type: String, default: "" },
    veh_number: { type: String, default: "" },
}, {
    timestamps: true
});
const MasterVoiceBox = new mongoose_1.default.Schema({
    enterprise_id: { type: String, default: "" },
    admin_id: { type: String, default: "" },
    voicebox: VoiceBox,
}, {
    timestamps: true
});
exports.MASTER_VOICE_BOX = mongoose_1.default.model("mastervoicebox", MasterVoiceBox, "mastervoicebox");

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.empschema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const eschma = new mongoose_1.default.Schema({
    empno: { type: Number },
    empname: { type: String },
    sal: { type: Number },
    imagepath: { type: String }
});
exports.empschema = mongoose_1.default.model('emp', eschma, 'emp');

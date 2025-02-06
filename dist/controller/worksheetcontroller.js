"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const empschema_1 = require("../mongodbschema/empschema");
const xlsx_1 = __importDefault(require("xlsx"));
const status_1 = require("../status/status");
const router = (0, express_1.default)();
router.post('/ExportExcelm', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        yield empschema_1.empschema.find({}).then((result) => {
            if (result.length > 0) {
                let response = JSON.parse(JSON.stringify(result));
                let workbook = xlsx_1.default.utils.book_new();
                let worksheet = xlsx_1.default.utils.json_to_sheet(response);
                xlsx_1.default.utils.book_append_sheet(workbook, worksheet, "Emp");
                xlsx_1.default.writeFile(workbook, "D:\\test\\Employee.xlsx");
                res.send(new status_1.Responsewithobject(200, "sucess", response));
            }
            else {
                res.send({ status: 400, message: "no data avaliable" });
            }
        }).catch((err) => {
            res.send({ status: 400, message: "no data available" });
        });
    }
    catch (error) {
    }
}));
router.post('/importexcel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let xlfile = xlsx_1.default.readFile("D:\\test\\Employee.xlsx");
        let sheet = xlfile.Sheets[xlfile.SheetNames[0]];
        let p_json = xlsx_1.default.utils.sheet_to_json(sheet);
        yield empschema_1.empschema.insertMany(p_json).then((result) => {
            if (result.length > 0) {
                res.send({ status: 200, message: "sucess", count: result.length });
            }
            else {
                res.send({ status: 400, message: "no data available" });
            }
        }).catch((err) => {
            console.log("excel into:" + err);
            res.send({ status: 400, message: "something went worng" });
        });
    }
    catch (error) {
        console.log(error);
        res.send({ status: 400, message: "error.message" });
    }
}));
module.exports = router;

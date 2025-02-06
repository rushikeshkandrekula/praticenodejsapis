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
const express_1 = require("express");
const router = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
const empschema_1 = require("../mongodbschema/empschema");
const fs_1 = __importDefault(require("fs"));
const filestorage = multer_1.default.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        let fileName = file.originalname;
        fileName = fileName.substr(0, fileName.indexOf('.')) + "-" + Date.now() + fileName.substr(fileName.indexOf("."));
        cb(null, fileName);
    }
});
let fileupload = (0, multer_1.default)({ storage: filestorage });
router.post("/singleimg", fileupload.single("pic"), (req, res) => {
    try {
        res.send({ staus: 200, message: "Sucess" });
    }
    catch (err) {
        res.send({ status: 400, message: 'err.message' });
    }
});
router.post('/uploadsingleimage', fileupload.single("pic"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imagePath = req.file.path;
        let body = req.body;
        body.imagepath = imagePath;
        console.log(imagePath);
        let empobj = new empschema_1.empschema(body);
        yield empobj.save().then((result1 => {
            if (Object.keys(result1).length > 0) {
                res.send({ status: 200, message: "sucess", data: result1 });
            }
            else {
                res.send({ status: 400, message: 'not inserted data' });
            }
        })).catch((e) => {
            console.log("v1/up" + e.message);
            res.send({ status: 500, message: 'e.message' });
        });
    }
    catch (error) {
        console.log("v3/up" + error.message);
        res.send({ status: 500, message: 'error.message' });
    }
}));
router.post('/uploadsingleimg', fileupload.single("pic"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imagePath = req.file.path;
        let body = req.body;
        body.imagepath = imagePath;
        console.log(imagePath);
        yield empschema_1.empschema.find({ empno: body.empno }).then((result) => __awaiter(void 0, void 0, void 0, function* () {
            if (result.length > 0) {
                fs_1.default.unlink(imagePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.send({ status: 400, message: 'err.message' });
                    }
                    else {
                        res.send({ status: 201, message: "body.empno + alredy exist and uplaod img deleted" });
                    }
                });
            }
            else {
                let empobj = new empschema_1.empschema(body);
                yield empobj.save().then((result1 => {
                    if (Object.keys(result1).length > 0) {
                        res.send({ status: 200, message: "sucess", data: result1 });
                    }
                    else {
                        res.send({ status: 400, message: 'not inserted data' });
                    }
                })).catch((e) => {
                    console.log("v1/up" + e.message);
                    res.send({ status: 500, message: 'e.message' });
                });
            }
        })).catch((err) => {
            console.log("v2/up" + err.message);
            res.send({ status: 500, message: 'err.message' });
        });
    }
    catch (error) {
        console.log("v3/up" + error.message);
        res.send({ status: 500, message: 'error.message' });
    }
}));
router.get('/getimage/:empno', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield empschema_1.empschema.find({ empno: req.params.empno }).then((result) => {
            if (result.length > 0) {
                // console.log(result);
                fs_1.default.readFile(result[0].imagepath, (err, data) => {
                    if (err) {
                        res.send({ status: 400, message: 'err.message' });
                    }
                    else {
                        res.end(data);
                    }
                });
            }
            else {
                res.send({ status: 400, message: 'no data avaliable' });
            }
        }).catch((err) => {
            res.send({ status: 400, message: 'err.message' });
        });
    }
    catch (err) {
        res.send({ status: 400, message: 'err.message' });
    }
}));
router.post('/updateimg', fileupload.single("pic"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filepath = req.file.path;
        let body = req.body;
        yield empschema_1.empschema.find({ empno: body.empno }).then((isexist) => __awaiter(void 0, void 0, void 0, function* () {
            if (isexist.length > 0) {
                yield empschema_1.empschema.updateOne({ empno: body.empno }, {
                    $set: {
                        empname: body.empname,
                        sal: body.sal,
                        imagepath: filepath
                    }
                }).then((result) => {
                    console.log(result);
                    if (result.modifiedCount.length > 0) {
                        fs_1.default.unlink(result[0].imagepath, (err) => {
                            if (err) {
                                res.send({ status: 400, message: 'err.message' });
                            }
                            else {
                                res.send({ status: 200, message: 'update sucess and deleted existing image for this employee' });
                            }
                        });
                    }
                    else {
                        fs_1.default.unlink(result[0].imagepath, (err) => {
                            if (err) {
                                res.send({ status: 400, message: 'err.message' });
                            }
                            else {
                                res.send({ status: 200, message: 'emp data and image are not updated' });
                            }
                        });
                    }
                }).catch((err) => {
                    res.send({ status: 502, message: 'err.message' });
                });
            }
            else {
                fs_1.default.unlink(filepath, (err) => {
                    if (err) {
                        res.send({ status: 400, message: 'err.message' });
                    }
                    else {
                        res.send({ status: 201, message: "empno" + body.empno + "does not exist &deleted current img" });
                    }
                });
            }
        })).catch((err) => {
            console.log("err:" + err.message);
            res.send({ status: 501, message: "err.message" });
        });
    }
    catch (error) {
        console.log("err:" + error.message);
        res.send({ status: 500, message: 'error.message' });
    }
}));
router.post('/deleteimg', fileupload.single("pic"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let filepath = req.file.path;
        let body = req.body;
        yield empschema_1.empschema.find({ empno: body.empno }).then((isexist) => __awaiter(void 0, void 0, void 0, function* () {
            if (isexist.length > 0) {
                yield empschema_1.empschema.deleteOne({ empno: body.empno })
                    .then((result1) => {
                    if (result1.deletedCount > 0) {
                        if (result1[0].imagepath) {
                            fs_1.default.unlink(result1[0].imagepath, (err) => {
                                if (err) {
                                    res.send({ status: 401, message: 'err.message' });
                                }
                                else {
                                    res.send({ status: 200, message: "delete sucess" });
                                }
                            });
                        }
                    }
                    else {
                        res.send({ status: 400, message: 'emp data not deleted' });
                    }
                }).catch((err) => {
                    res.send({ status: 500, message: 'err.message' });
                });
            }
            else {
                res.send({ status: 400, message: "empno doesnt exists" });
            }
        }));
    }
    catch (err) {
        res.send({ status: 501, message: 'err.message' });
    }
}));
module.exports = router;

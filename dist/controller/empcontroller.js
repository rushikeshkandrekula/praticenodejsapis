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
const mastervoicebox_1 = require("../mongodbschema/mastervoicebox");
const stomaster_1 = require("../mongodbschema/stomaster");
const transportschema_1 = require("../mongodbschema/transportschema");
const status_1 = require("../status/status");
const drilocationschema_1 = require("../mongodbschema/drilocationschema");
const driversschema_1 = require("../mongodbschema/driversschema");
const router = (0, express_1.default)();
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let empbody = new empschema_1.empschema(body);
    yield empbody.save().then((result) => {
        res.send({ status: 200, message: "sucess" });
    }).catch((e) => {
        res.send({ status: 400, message: e.message });
    });
}));
router.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    yield empschema_1.empschema.updateOne({ empno: body.empno }, {
        $set: {
            empname: body.empname,
            sal: body.sal
        }
    }).then((result) => {
        res.send({ stauts: 200, message: 'updated' });
    }).catch((e) => {
        res.send({ status: 400, message: e.message });
    });
}));
router.post('/get', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    yield empschema_1.empschema.find({}).then((result) => {
        if (result.length > 0) {
            res.send({ status: 200, message: "data available", data: result });
        }
        else {
            res.send({ status: 400, message: "no data available" });
        }
    }).catch((e) => {
        res.send({ status: 400, message: e.message });
    });
}));
function cuurentDateTime() {
    let date = new Date();
    return date;
}
router.post('/createstop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let isexitsname = yield stomaster_1.STOP_MASTER_SCHEMA.findOne({ name: body.name }).exec();
    if (!isexitsname) {
        let isexitlatlag = yield stomaster_1.STOP_MASTER_SCHEMA.findOne({ lat: body.lat, lng: body.lng }).exec();
        if (!isexitlatlag) {
            body.name = body.name;
            body.coordinates = [body.lat, body.lng];
            body.createddate = cuurentDateTime();
            let newstop = new stomaster_1.STOP_MASTER_SCHEMA(body);
            newstop.save().then((result) => {
                res.send(new status_1.Responsewithobject(200, "stop created", newstop));
            }).catch((err) => {
                res.send({ status: 400, message: 'err.message' });
            });
        }
        else {
            res.send(new status_1.ErrResponseobject(400, 'latlng alrady exit ' + isexitlatlag.name));
        }
    }
    else {
        res.send(new status_1.ErrResponseobject(400, 'SomeTHING WENT WORNG'));
    }
}));
router.post('/updatestop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let locationobj = yield stomaster_1.STOP_MASTER_SCHEMA.findOne({ "_id": body.id }).exec();
        if (locationobj.name != body.name) {
            let existname = yield stomaster_1.STOP_MASTER_SCHEMA.findOne({ name: body.name }).exec();
            if (existname) {
                res.send({ status: 400, message: 'location name already exists' });
                return;
            }
        }
        yield stomaster_1.STOP_MASTER_SCHEMA.updateOne({ "_id": body.id }, {
            $set: {
                name: body.name,
                lat: body.lat,
                lng: body.lng,
                coordinates: [body.lat, body.lng],
                location: body.location,
            }
        }).then((result) => {
            if (result) {
                res.send({ status: 200, message: "updated stop" });
            }
            else {
                res.send({ status: 500, message: 'something went wrong' });
            }
        }).catch((err) => {
            res.send({ status: 400, message: 'err.message' });
        });
    }
    catch (error) {
        res.send({ status: 400, message: 'something went worng' });
    }
}));
router.post('/deletestop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let stop = yield stomaster_1.STOP_MASTER_SCHEMA.findOne({ "_id": body._id }).exec();
        if (stop) {
            yield stomaster_1.STOP_MASTER_SCHEMA.deleteOne({ "_id": body._id }).then(result => {
                res.send({ status: 400, message: 'deleted sucessfully' });
            }).catch(err => {
                res.send({ status: 400, message: 'err.message' });
            });
        }
        else {
            res.send({ status: 400, message: 'data not avaliablr' });
        }
    }
    catch (err) {
        res.send({ status: 500, message: 'something went wrong' });
    }
}));
router.post('/createvoicebox', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        if (body.savemode == 'create') {
            let dublicateimei = yield mastervoicebox_1.MASTER_VOICE_BOX.find({ 'voicebox.imei': body.imei }).exec();
            if (dublicateimei && dublicateimei.length > 0) {
                res.send({ status: 400, message: 'dupicate imei' });
                return;
            }
            let voicebox = new mastervoicebox_1.MASTER_VOICE_BOX({
                enterprise_id: body.enterprise_id,
                admin_id: body.admin_id,
                voicebox: {
                    model_id: body.model_id,
                    msis_dn: body.msis_dn,
                    model_name: body.model_name,
                    model_desc: body.model_desc,
                    imei: body.imei
                }
            });
            yield voicebox.save();
            res.send({ status: 200, message: 'sucesss', voicebox });
        }
        else {
            yield mastervoicebox_1.MASTER_VOICE_BOX.updateOne({ 'voicebox.imei': body.imei }, {
                $set: {
                    'voicebox.model_id': body.model_id,
                    'voicebox.msis_dn': body.msis_dn,
                    'voicebox.model_name': body.model_name,
                    'voicebox.model_desc': body.model_desc
                },
            }).then((result) => {
                res.send({ status: 200, message: 'updated voicebox' });
            }).catch((err) => {
                res.send({ status: 400, message: 'Error in voicebox' });
            });
        }
    }
    catch (error) {
        res.send({ status: 400, message: 'Error in voicebox' });
    }
}));
router.post('/driverlocation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let driverloc = new drilocationschema_1.driverslocationschema(body);
    yield driverloc.save().then((result) => {
        res.send({ status: 200, message: "sucess" });
    }).catch((err) => {
        res.send({ status: 400, message: err.message });
    });
}));
router.post('/getdriverloc', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    yield drilocationschema_1.driverslocationschema.find({}).then((result) => {
        if (result) {
            // console.log(result)
            res.send({ status: 200, message: "data available", data: result });
        }
        else {
            res.send({ status: 400, message: "no data" });
        }
    });
}));
router.post('/deletedriver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body;
        let driver = yield driversschema_1.Driverschema.find({ _id: body._id }).exec();
        if (driver) {
            console.log(driver);
            yield driversschema_1.Driverschema.deleteOne({ _id: body._id }).then(result => {
                if (result) {
                    res.send({ status: 200, message: 'deleted sucessfully' });
                }
            }).catch(err => {
                console.log("Error in delete1:" + err.message);
                res.send({ status: 400, message: 'err.message' });
            });
        }
        else {
            res.send({ status: 400, message: 'data not avaliablr' });
        }
    }
    catch (err) {
        console.log("Error in delete:" + err.message);
        res.send({ status: 500, message: 'something went wrong' });
    }
}));
router.post('/createdriver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    if (body._id) {
        let driverid = yield driversschema_1.Driverschema.find({ "_id": body._id }).exec();
        if (driverid.length > 0) {
            yield driversschema_1.Driverschema.updateOne({ "_id": body._id }, {
                $set: {
                    "driverName": body.driverName,
                    "Contact": body.mno,
                    "mailId": body.mailId,
                    "badgenumber": body.badgenumber,
                    "address": body.address,
                    "city": body.city
                }
            }).then((result) => {
                res.send({ status: 200, message: "update sucess" });
            }).catch((err) => {
                res.send({ status: 400, message: "err.message" });
            });
        }
        else {
            res.send({ status: 400, message: "error" });
        }
    }
    else {
        // let drivercheck :any = await Driverschema.findOne({ "Contact": body.mno }).exec();
        // if (!drivercheck) {
        let drivername = new driversschema_1.Driverschema(body);
        drivername.save().then((result) => {
            res.send({ status: 200, message: "sucess", drivername });
        }).catch((err) => {
            res.send({ status: 400, message: "err.message" });
        });
        // }
        // else {
        //     res.send({ status: 400, message: "Driver mno already exists" })
        // }
    }
}));
router.post('/getdrivers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    yield driversschema_1.Driverschema.find({}).then((result) => {
        if (result.length > 0) {
            let finalarray = [];
            result.forEach(element => {
                let obj = new Object();
                obj.drivername = element.driverName,
                    obj.mobile = element.Contact ? element.Contact : 0,
                    obj.mailid = element.mailId ? element.mailId : "",
                    obj.badgenumber = element.badgenumber ? element.badgenumber : 0,
                    obj.addresss = element.address ? element.address : "",
                    obj.city = element.city ? element.city : "";
                obj._id = element._id;
                finalarray.push(obj);
            });
            res.send({ status: 200, message: "data available", data: finalarray });
        }
        else {
            res.send({ status: 400, message: "no data available" });
        }
    }).catch((err) => {
        res.send({ status: 500, message: "Something went wrong" });
    });
}));
router.post('/getdriverdropdown', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let bquery = {};
    bquery = [{
            $match: {
                "driverName": { $in: body.drivername }
            }
        }
    ];
    yield driversschema_1.Driverschema.aggregate(bquery).allowDiskUse(true).then((response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(response);
        let finalresult = response;
        res.send({ status: 200, message: "Data Avaliable", data: finalresult });
    })).catch((err) => {
        console.log("Error in getdriverdropdown: " + err.message);
    });
}));
router.post('/transportinsert', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let empbody = new transportschema_1.Transportschema(body);
    yield empbody.save().then((result) => {
        res.send({ status: 200, message: "sucess" });
    }).catch((e) => {
        res.send({ status: 400, message: e.message });
    });
}));
router.post('/transportupdate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    let transportid = yield transportschema_1.Transportschema.find({ "_id": "body.id" });
    if (transportid.length > 0) {
        yield transportschema_1.Transportschema.updateOne({ "_id": body.id }, {
            $set: {
                "address1": body.address1,
                "city": body.city,
                "countryID": body.countryID,
                "fullName": body.fullName,
                "mailId": body.mailId,
                "mobileNumber": body.mobileNumber,
                "pincode": body.pincode,
                "stateID": body.stateID,
                "tagID": body.tagID,
                "taxNo": body.taxNo,
                "tradingName": body.tradingName,
                "erpCode": body.erpCode
            }
        }).then((result) => {
            res.send({ status: 200, message: "updated sucessfully" });
        }).catch((err) => {
            res.send({ status: 400, message: "NO Data Available" });
        });
    }
    else {
        res.send({ status: 400, message: "NO Data Available" });
    }
}));
router.post('/transportget', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    yield transportschema_1.Transportschema.find({}).then((result) => {
        if (result.length > 0) {
            res.send({ status: 200, message: "data available", data: result });
        }
        else {
            res.send({ status: 400, message: "no data available" });
        }
    }).catch((e) => {
        res.send({ status: 400, message: e.message });
    });
}));
module.exports = router;

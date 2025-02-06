import Router from 'express';
import { empschema } from '../mongodbschema/empschema';
import { MASTER_VOICE_BOX } from '../mongodbschema/mastervoicebox';
import { STOP_MASTER_SCHEMA } from '../mongodbschema/stomaster';
import { Transportschema } from '../mongodbschema/transportschema';
import { Responsewithobject, ErrResponseobject } from '../status/status';
import { driverslocationschema } from '../mongodbschema/drilocationschema';
import { Driverschema } from '../mongodbschema/driversschema';
import { Aggregate } from 'mongoose';
const router = Router();

router.post('/create', async (req, res) => {
    let body = req.body;
    let empbody = new empschema(body);
    await empbody.save().then((result) => {
        res.send({ status: 200, message: "sucess" })
    }).catch((e) => {
        res.send({ status: 400, message: e.message })
    })
});


router.post('/update', async (req, res) => {
    let body = req.body;
    await empschema.updateOne({ empno: body.empno },
        {
            $set: {
                empname: body.empname,
                sal: body.sal
            }
        }).then((result) => {
            res.send({ stauts: 200, message: 'updated' })
        }).catch((e) => {
            res.send({ status: 400, message: e.message })
        })

});

router.post('/get', async (req, res) => {
    let body = req.body;
    await empschema.find({}).then((result) => {
        if (result.length > 0) {
            res.send({ status: 200, message: "data available", data: result })
        }
        else {
            res.send({ status: 400, message: "no data available" })
        }
    }).catch((e) => {
        res.send({ status: 400, message: e.message })
    })
})
function cuurentDateTime() {
    let date = new Date();
    return date;
}
router.post('/createstop', async (req, res) => {
    let body = req.body;
    let isexitsname = await STOP_MASTER_SCHEMA.findOne({ name: body.name }).exec();
    if (!isexitsname) {
        let isexitlatlag = await STOP_MASTER_SCHEMA.findOne({ lat: body.lat, lng: body.lng }).exec();
        if (!isexitlatlag) {
            body.name = body.name;
            body.coordinates = [body.lat, body.lng];
            body.createddate = cuurentDateTime();
            let newstop = new STOP_MASTER_SCHEMA(body);
            newstop.save().then((result) => {
                res.send(new Responsewithobject(200, "stop created", newstop))
            }).catch((err) => {
                res.send({ status: 400, message: 'err.message' })
            })
        }
        else {
            res.send(new ErrResponseobject(400, 'latlng alrady exit ' + isexitlatlag.name))
        }


    }
    else {
        res.send(new ErrResponseobject(400, 'SomeTHING WENT WORNG'))
    }
})
router.post('/updatestop', async (req, res) => {
    try {
        let body = req.body;
        let locationobj: any = await STOP_MASTER_SCHEMA.findOne({ "_id": body.id }).exec();
        if (locationobj.name != body.name) {
            let existname = await STOP_MASTER_SCHEMA.findOne({ name: body.name }).exec();
            if (existname) {
                res.send({ status: 400, message: 'location name already exists' })
                return;
            }

        }

        await STOP_MASTER_SCHEMA.updateOne({ "_id": body.id },
            {
                $set: {
                    name: body.name,
                    lat: body.lat,
                    lng: body.lng,
                    coordinates: [body.lat, body.lng],
                    location: body.location,


                }
            }).then((result) => {
                if (result) {
                    res.send({ status: 200, message: "updated stop" })
                } else {
                    res.send({ status: 500, message: 'something went wrong' })
                }
            }).catch((err) => {
                res.send({ status: 400, message: 'err.message' })
            })

    } catch (error) {
        res.send({ status: 400, message: 'something went worng' })

    }
})

router.post('/deletestop', async (req, res) => {
    try {
        let body = req.body;
        let stop = await STOP_MASTER_SCHEMA.findOne({ "_id": body._id }).exec();
        if (stop) {
            await STOP_MASTER_SCHEMA.deleteOne({ "_id": body._id }).then(result => {
                res.send({ status: 400, message: 'deleted sucessfully' })


            }).catch(err => {
                res.send({ status: 400, message: 'err.message' })

            })
        }
        else {
            res.send({ status: 400, message: 'data not avaliablr' })
        }
    } catch (err) {
        res.send({ status: 500, message: 'something went wrong' })

    }
})


router.post('/createvoicebox', async (req, res) => {
    try {
        let body = req.body;
        if (body.savemode == 'create') {
            let dublicateimei = await MASTER_VOICE_BOX.find({ 'voicebox.imei': body.imei }).exec();
            if (dublicateimei && dublicateimei.length > 0) {
                res.send({ status: 400, message: 'dupicate imei' })
                return;
            }
            let voicebox = new MASTER_VOICE_BOX({
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
            await voicebox.save();
            res.send({ status: 200, message: 'sucesss', voicebox })

        }
        else {
            await MASTER_VOICE_BOX.updateOne({ 'voicebox.imei': body.imei }, {
                $set: {
                    'voicebox.model_id': body.model_id,
                    'voicebox.msis_dn': body.msis_dn,
                    'voicebox.model_name': body.model_name,
                    'voicebox.model_desc': body.model_desc

                },
            }).then((result) => {
                res.send({ status: 200, message: 'updated voicebox' })
            }).catch((err) => {
                res.send({ status: 400, message: 'Error in voicebox' })
            })

        }

    } catch (error) {
        res.send({ status: 400, message: 'Error in voicebox' })

    }
})
router.post('/driverlocation', async (req, res) => {
    let body = req.body;
    let driverloc = new driverslocationschema(body);
    await driverloc.save().then((result) => {
        res.send({ status: 200, message: "sucess" })
    }).catch((err) => {
        res.send({ status: 400, message: err.message })
    })
});
router.post('/getdriverloc', async (req, res) => {
    let body = req.body;
    await driverslocationschema.find({ }).then((result) => {
        if (result) {
            // console.log(result)
            res.send({ status: 200, message: "data available", data: result })

        }
        else {
            res.send({ status: 400, message: "no data" })
        }
    })
})
router.post('/deletedriver', async (req, res) => {
    try {
        let body = req.body;
        let driver: any = await Driverschema.find({ _id: body._id }).exec();
        if (driver) {
            console.log(driver);
            await Driverschema.deleteOne({ _id: body._id }).then(result => {
                if (result) {
                    res.send({ status: 200, message: 'deleted sucessfully' });
                }
            }).catch(err => {
                console.log("Error in delete1:" + err.message)
                res.send({ status: 400, message: 'err.message' })

            })
        }
        else {
            res.send({ status: 400, message: 'data not avaliablr' })
        }
    } catch (err: any) {
        console.log("Error in delete:" + err.message)
        res.send({ status: 500, message: 'something went wrong' })

    }
})
router.post('/createdriver', async (req, res) => {
    let body = req.body;
    if (body._id) {
        let driverid = await Driverschema.find({ "_id": body._id }).exec();
        if (driverid.length > 0) {
            await Driverschema.updateOne({ "_id": body._id },
                {
                    $set: {
                        "driverName": body.driverName,
                        "Contact": body.mno,
                        "mailId": body.mailId,
                        "badgenumber": body.badgenumber,
                        "address": body.address,
                        "city":body.city


                    }
                }).then((result) => {
                    res.send({ status: 200, message: "update sucess" })

                }).catch((err) => {
                    res.send({ status: 400, message: "err.message" })
                })


        }
        else {
            res.send({ status: 400, message: "error" })
        }

    }
    else {
        // let drivercheck :any = await Driverschema.findOne({ "Contact": body.mno }).exec();
        // if (!drivercheck) {
        let drivername = new Driverschema(body);
        drivername.save().then((result) => {
            res.send({ status: 200, message: "sucess", drivername })
        }).catch((err) => {
            res.send({ status: 400, message: "err.message" })

        })

        // }
        // else {
        //     res.send({ status: 400, message: "Driver mno already exists" })
        // }
    }

})
router.post('/getdrivers', async (req, res) => {
    let body = req.body;
    await Driverschema.find({}).then((result) => {
        if (result.length > 0) {
            let finalarray: any = [];
            result.forEach(element => {
                let obj: any = new Object();
                obj.drivername = element.driverName,
                    obj.mobile = element.Contact ? element.Contact : 0,
                    obj.mailid = element.mailId ? element.mailId : "",
                    obj.badgenumber = element.badgenumber ? element.badgenumber : 0,
                    obj.addresss = element.address ? element.address : "",
                    obj.city = element.city ? element.city:""
                   obj._id = element._id
                finalarray.push(obj);
                console.log(finalarray)

            })

            res.send({ status: 200, message: "data available", data: finalarray })
        }
        else {
            res.send({ status: 400, message: "no data available" })
        }
    }).catch((err) => {
        res.send({ status: 500, message: "Something went wrong" })

    })

});

router.post('/getdriverdropdown', async (req,res)=>{
    let body = req.body;
    let bquery:any = {};
    bquery =[ {
        $match: {
        "driverName":{$in: body.drivername}
        }
    }
      
    ];
    await Driverschema.aggregate(bquery).allowDiskUse(true).then(async response=>{
        console.log(response);
        let finalresult :any = response;
        res.send({status:200,message:"Data Avaliable", data:finalresult})

    }).catch((err)=>{

        console.log("Error in getdriverdropdown: " + err.message);
    })
    

})

router.post('/transportinsert', async (req, res) => {
    let body = req.body;
    let empbody = new Transportschema(body);
    await empbody.save().then((result) => {
        res.send({ status: 200, message: "sucess" })
    }).catch((e) => {
        res.send({ status: 400, message: e.message })
    })
});
router.post('/transportupdate', async (req, res) => {
    let body = req.body;
    let transportid: any = await Transportschema.find({ "_id": "body.id" })
    if (transportid.length > 0) {
        await Transportschema.updateOne({ "_id": body.id },
            {
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
                res.send({ status: 200, message: "updated sucessfully" })
            }).catch((err) => {
                res.send({ status: 400, message: "NO Data Available" })
            })



    }
    else {
        res.send({ status: 400, message: "NO Data Available" })
    }
})
router.post('/transportget', async (req, res) => {
    let body = req.body;
    await Transportschema.find({}).then((result) => {
        if (result.length > 0) {
            res.send({ status: 200, message: "data available", data: result })
        }
        else {
            res.send({ status: 400, message: "no data available" })
        }
    }).catch((e) => {
        res.send({ status: 400, message: e.message })
    })
})



export = router;
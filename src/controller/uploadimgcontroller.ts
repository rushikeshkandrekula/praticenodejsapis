import { Router } from 'express';
const router = Router();
import multer from 'multer';
import { empschema } from '../mongodbschema/empschema';
import fs from 'fs';

const filestorage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {

        let fileName = file.originalname
        fileName = fileName.substr(0, fileName.indexOf('.')) + "-" + Date.now() + fileName.substr(fileName.indexOf("."));
        cb(null, fileName)

    }

})
let fileupload = multer({ storage: filestorage })

router.post("/singleimg", fileupload.single("pic"), (req, res) => {
    try {
        res.send({ staus: 200, message: "Sucess" })
    } catch (err) {
        res.send({ status: 400, message: 'err.message' })
    }

})

router.post('/uploadsingleimage', fileupload.single("pic"), async (req, res) => {
    try {
        let imagePath = req.file.path;
        let body = req.body;
        body.imagepath = imagePath;
        console.log(imagePath)
       
                let empobj = new empschema(body);
                await empobj.save().then((result1 => {
                    if (Object.keys(result1).length > 0) {
                        res.send({ status: 200, message: "sucess", data: result1 })
                    }
                    else {
                        res.send({ status: 400, message: 'not inserted data' })
                    }

                })).catch((e) => {
                    console.log("v1/up" + e.message)
                    res.send({ status: 500, message: 'e.message' })
                })

      

    } catch (error: any) {
        console.log("v3/up" + error.message)
        res.send({ status: 500, message: 'error.message' })

    }
})
router.post('/uploadsingleimg', fileupload.single("pic"), async (req, res) => {
    try {
        let imagePath = req.file.path;
        let body = req.body;
        body.imagepath = imagePath;
        console.log(imagePath)
        await empschema.find({ empno: body.empno }).then(async (result) => {

            if (result.length > 0) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.log(err)
                        res.send({ status: 400, message: 'err.message' })
                    }
                    else {
                        res.send({ status: 201, message: "body.empno + alredy exist and uplaod img deleted" })
                    }
                })

            } else {
                let empobj = new empschema(body);
                await empobj.save().then((result1 => {
                    if (Object.keys(result1).length > 0) {
                        res.send({ status: 200, message: "sucess", data: result1 })
                    }
                    else {
                        res.send({ status: 400, message: 'not inserted data' })
                    }

                })).catch((e) => {
                    console.log("v1/up" + e.message)
                    res.send({ status: 500, message: 'e.message' })
                })

            }
        }).catch((err) => {
            console.log("v2/up" + err.message)
            res.send({ status: 500, message: 'err.message' })

        })   

    } catch (error: any) {
        console.log("v3/up" + error.message)
        res.send({ status: 500, message: 'error.message' })

    }
})

router.get('/getimage/:empno', async (req, res) => {
    try {
        await empschema.find({ empno: req.params.empno }).then((result: any) => {
            if (result.length > 0) {
                // console.log(result);
                fs.readFile(result[0].imagepath, (err, data) => {
                    if (err) {
                        res.send({ status: 400, message: 'err.message' })
                    }
                    else {
                        res.end(data);
                    }
                })

            }
            else {
                res.send({ status: 400, message: 'no data avaliable' })
            }
        }).catch((err) => {
            res.send({ status: 400, message: 'err.message' })

        })
    } catch (err) {
        res.send({ status: 400, message: 'err.message' })

    }


})

router.post('/updateimg', fileupload.single("pic"), async (req, res) => {
    try {
        let filepath = req.file.path;
        let body = req.body;
        await empschema.find({ empno: body.empno }).then(async (isexist: any) => {
            if (isexist.length > 0) {
                await empschema.updateOne({ empno: body.empno },
                    {
                        $set: {
                            empname: body.empname,
                            sal: body.sal,
                            imagepath: filepath

                        }
                    }).then((result: any) => {
                        console.log(result);
                        if (result.modifiedCount.length > 0) {
                            fs.unlink(result[0].imagepath, (err) => {
                                if (err) {
                                    res.send({ status: 400, message: 'err.message' })
                                }
                                else {
                                    res.send({ status: 200, message: 'update sucess and deleted existing image for this employee' })
                                }
                            })

                        } else {
                            fs.unlink(result[0].imagepath, (err) => {
                                if (err) {
                                    res.send({ status: 400, message: 'err.message' })

                                }
                                else {
                                    res.send({ status: 200, message: 'emp data and image are not updated' })
                                }
                            })
                        }
                    }).catch((err) => {
                        res.send({ status: 502, message: 'err.message' })
                    })
            }
            else {
                fs.unlink(filepath, (err) => {
                    if (err) {
                        res.send({ status: 400, message: 'err.message' })
                    }
                    else {
                        res.send({ status: 201, message: "empno" + body.empno + "does not exist &deleted current img" })
                    }
                })

            }

        }).catch((err) => {
            console.log("err:" + err.message)
            res.send({ status: 501, message: "err.message" })
        })
    } catch (error: any) {
        console.log("err:" + error.message)
        res.send({ status: 500, message: 'error.message' })

    }
})

router.post('/deleteimg', fileupload.single("pic"), async (req, res) => {
    try {
       // let filepath = req.file.path;
        let body = req.body;
        await empschema.find({ empno: body.empno }).then(async (isexist) => {
            if (isexist.length > 0) {
                await empschema.deleteOne({ empno: body.empno })
                    .then((result1: any) => {
                        if (result1.deletedCount > 0) {
                            if (result1[0].imagepath) {

                                fs.unlink(result1[0].imagepath, (err) => {
                                    if (err) {
                                        res.send({ status: 401, message: 'err.message' })
                                    }
                                    else {
                                        res.send({ status: 200, message: "delete sucess" })
                                    }

                                })
                            }
                        }
                        else {
                            res.send({status:400,message:'emp data not deleted'})

                        }

                    }).catch((err) => {
                        res.send({ status: 500, message: 'err.message' })
                    })

            } else {
                res.send({ status: 400, message: "empno doesnt exists" })
            }

        })
    } catch (err) {
        res.send({ status: 501, message: 'err.message' })

    }
})
export = router;
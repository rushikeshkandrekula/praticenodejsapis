import Router from 'express';
import { empschema } from '../mongodbschema/empschema';
import xlsx from 'xlsx';
import { Responsewithobject } from '../status/status';
const router =Router();

router.post('/ExportExcelm', async (req,res)=>{
    try {
        let body =req.body;
        await empschema.find({}).then((result)=>{
            if (result.length > 0){
                let response = JSON.parse(JSON.stringify(result));
                let workbook =xlsx.utils.book_new();
                let worksheet =xlsx.utils.json_to_sheet(response);
                xlsx.utils.book_append_sheet(workbook,worksheet,"Emp");
                xlsx.writeFile( workbook,"D:\\test\\Employee.xlsx");
                res.send(new Responsewithobject(200, "sucess",response))


            }
            else{
                res.send({status:400, message:"no data avaliable"})
            }

        }).catch((err)=>{
            res.send({status:400, message:"no data available"})
        })
        
    } catch (error) {
        
    }
   

})


router.post ('/importexcel',async (req,res)=>{
    try {
        
        let xlfile = xlsx.readFile("D:\\test\\Employee.xlsx");
        let sheet = xlfile.Sheets[xlfile.SheetNames[0]];
        let p_json = xlsx.utils.sheet_to_json(sheet);
        await empschema.insertMany(p_json).then((result)=>{
            if(result.length > 0 ){
                res.send({status:200 ,message:"sucess",count:result.length})
            }
            else{
                res.send({status:400, message:"no data available"})

            }
        }).catch((err)=>{
            console.log("excel into:"+err)
            res.send({status:400, message:"something went worng"})
        })
        
    } catch (error) {
        console.log(error)
        res.send({status:400, message:"error.message"})
        
    }
})
export= router;
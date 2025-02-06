import mongoose from 'mongoose';
const driversappschema = new mongoose.Schema({
    driverName:{type:String},
    Contact:{type:String},
    mailId:{type:String},
    badgenumber :{type:Number},
    address:{type:String},
    city: { type: String , default: "" },
    
});
 export const Driverschema= mongoose.model('driver',driversappschema,'driver')
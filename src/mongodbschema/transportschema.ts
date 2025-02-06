import mongoose from 'mongoose';
const transportschema = new mongoose.Schema({
    fullName:{type:String},
    tradingName:{type:String},
    erpCode:{type:Number},
    taxID :{ type: Number},
    taxNo:{type:Number},
    mobileNumber:{type:String},
    mailId:{type:String},
    countryID:{type:String},
    address1:{type:String},
    city:{type:String},
    stateID:{type:String}
});
 export const Transportschema= mongoose.model('transport',transportschema,'transport')
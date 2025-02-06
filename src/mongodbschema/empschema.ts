import mongoose from 'mongoose';
const eschma = new mongoose.Schema({
empno:{type:Number},
empname:{type:String},
sal:{type:Number},
imagepath :{ type: String}
});
 export const empschema= mongoose.model('emp',eschma,'emp')
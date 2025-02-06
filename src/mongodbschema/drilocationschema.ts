import mongoose from 'mongoose';
const drilocschema = new mongoose.Schema({

    countryID:{type:String},
    address1:{type:String},
    city:{type:String},
    stateID:{type:String}
});
 export const driverslocationschema= mongoose.model('driverloc',drilocschema,'driverloc')
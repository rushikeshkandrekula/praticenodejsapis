import mongoose from 'mongoose';
const StopMaster = new mongoose.Schema({
    name: { type: String, default: "" }, //stop name
    description: { type: String, default: "" },
    lat: { type: String, default: "" },
    lng: { type: String, default: "" },
    location: { type: String, default: "" },
    coordinates: [], // [lat,lng]
    createddate: { type: Date },
    updateddate: { type: Date },
    updatedby: { type: String, default: "" },
    createdby: { type: String, default: "" },//user id
    stoptype: { type: String, default: "" },
    stoptypedesc: { type: String, default: "" },
    clientid: { type: String, default: "" },
    isUnauthorized: { type: Boolean, default: false },
    isGeofence: { type: Boolean, default: false },
    isDetention: { type: Boolean, default: false },
    geofence: {
        lat: { type: String, default: "" },
        long: { type: String, default: "" },
        radius: { type: Number, default: 0 }
    },
    erpcode: { type: String, default: "" },
    phoneNo: { type: String, default: "" },
    speedlimit: { type: String, default: "" },
    email: { type: Array, default: [] },
    users: { type: Array, default: [] },
    area: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" }
});

export var STOP_MASTER_SCHEMA = mongoose.model("stopmaster", StopMaster, "stopmaster");
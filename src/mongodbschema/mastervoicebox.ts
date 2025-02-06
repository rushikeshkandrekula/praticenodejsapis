import mongoose from 'mongoose';




const VoiceBox = new mongoose.Schema({
    model_id: { type: String, default: "" },
    msis_dn:{ type: String, default: "" },
    model_name: { type: String, default: "" },
    model_desc: { type: String, default: "" },
    imei: { type: String, default: "" },
    jmti_id: { type: String, default: "" },
    isonboarded:{type:Boolean,default:false},
    isWhitelisted:{type:Boolean,default:false},
    access_key: { type: String, default: "" },
    model_oem: { type: String, default: "" },
    veh_number: { type: String, default: "" },
}, {
    timestamps: true
});

const MasterVoiceBox = new mongoose.Schema({
    enterprise_id: { type: String, default: ""},
    admin_id: { type: String, default: "" },
    voicebox: VoiceBox,
}, {
    timestamps: true
});

export var MASTER_VOICE_BOX = mongoose.model("mastervoicebox", MasterVoiceBox, "mastervoicebox");
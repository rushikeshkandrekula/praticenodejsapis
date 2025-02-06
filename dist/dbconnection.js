"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoconn = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// import mysql2 from 'mysql2';
//const url ="mongodb://127.0.0.1/employee";
const url = "mongodb://127.0.0.1/d4";
function mongoconn() {
    mongoose_1.default.connect(url, (err) => {
        if (err) {
            console.log("not able to connected mongoose");
        }
        else {
            console.log("connected to mongodb");
        }
    });
}
exports.mongoconn = mongoconn;
let mysqlconnection = {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: "d4",
    multipleStatements: true
};
//  export let dbpool=mysql2.createPool(mysqlconnection);
//  dbpool.getConnection((err,connection)=>{
//      if(err){
//          console.log(err.message+""+"not able to connected mysql")
//      } else{
//          console.log("connected to mysql")
//      }
//  })
// export=dbpool;

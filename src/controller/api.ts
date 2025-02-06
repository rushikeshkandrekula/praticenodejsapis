import express from 'express';
import empcon from './empcontroller';
import exportexcle from './worksheetcontroller';
import imgupload from './uploadimgcontroller'
const app1 =express();
app1.use('/CRUD',empcon);
app1.use('/CRUD',exportexcle);
app1.use('/CRUD',imgupload)
export = app1;

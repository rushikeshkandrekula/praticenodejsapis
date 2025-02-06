 export class Responsewithobject{
    public status:any;
    public message:any;
    public details:any;
    constructor(status =200, message ='', details ={}){
        this.status = status;
        this.message =message ;
        this.details = details
    }
 }

  export class ErrResponseobject{
    public status:any;
    public message:any;
    public details:any;
    constructor(status =400, message ='', details ={}){
        this.status =status;
        this.message =message;
        this.details =details;
    }
 }
import {Deserializable} from "./deserializable.model";
export class Chat implements Deserializable {
    _id: String;
    type:String;
    text:String;
    time:Date;
    file:any;
    createdAt:Date;
    updatedAt:Date;
    to:Object;
    user:Object;
    roomId:String; 
    from:Object;   
    data:File;
    imageLink:any;
    isNew:boolean=false;
    deserialize(input: any) {
        Object.assign(this, input);
        this.createdAt = this.time;
        input.message?this.text=input.message:this.text=this.text;
        return this;
      }
     

}
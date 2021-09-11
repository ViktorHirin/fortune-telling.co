import {Deserializable} from "./deserializable.model";
import { environment} from 'environments/environment';
export class CallHistory implements Deserializable {
    _id: string;
    to:any;
    token:number;
    avartarUrl:string;
    recordingUrl:String;
    callDuration:number;
    userId:any;
    rating:number=3;
    createdAt:Date;
    updatedAt:Date;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
    getFullName(type:string=null):string{
      if(type == null){
        return this.to.firstName + ' ' + this.to.lastName;
      }
      else
      {
        return this.userId.firstName+ ' '+ this.userId.lastName;
      }
     
    }
    getCallDuration():number{
        return Math.floor(this.callDuration/60)+1;
    }
    getToken(price:number):number{
        return (Math.floor(this.callDuration/60)+1)*price;
    }
    getAvatar():string{
      if(this.avartarUrl != null){
      return environment.apiUrl+'/'+ this.avartarUrl;
      }
      return environment.apiUrl+'/'+ "assets/images/img.jpg";
    }

}

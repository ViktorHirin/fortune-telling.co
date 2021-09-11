import {Deserializable} from "./deserializable.model";
import {User} from './user';
export class Order  implements Deserializable{
    ipAddress:String;
    lastCreditCard:String;
    token:number;
    reviewer:User;
    createdAt:Date;
    name:string;
    email:string;
    status:string;
    type:string;
    transactionId:string;
    deserialize(input: any) {
        Object.assign(this, input);
        this.createdAt=new Date(input.createdAt);
        this.name= input.userId.firstName +' '+ input.userId.lastName;
        this.email=input.userId.email;
        return this;
      }
    setUser(userInput:any){
      this.reviewer=new User().deserialize(userInput);
      return this;
    }
    
    
}
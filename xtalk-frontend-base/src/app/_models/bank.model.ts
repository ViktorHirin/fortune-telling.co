import {Deserializable} from "./deserializable.model";
import {User} from './user';
export class Bank  implements Deserializable{
    constructor(){
      this.nameBank="US",
      this.name="bank 1";
      this.country="US",
      this.accountNo='11111111';
      this.swiftCode='',
      this.routingNumber=''
    }
    swiftCode:string;
    routingNumber:string;
    nameBank:string;
    name:string;
    country:string;
    accountNo:string;
    userId:string;
    user:User;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
    setUser(userInput:any){
      this.user=new User().deserialize(userInput);
      return this;
    }
    
    
}
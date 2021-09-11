import {Deserializable} from "./deserializable.model";
import {User} from './user';
export class Review  implements Deserializable{
    userId:String;
    rating:User;
    content:String;
    reviewer:User;
    createdAt:Date;
    deserialize(input: any) {
        Object.assign(this, input);
        this.createdAt=new Date(input.createdAt);
        return this;
      }
    setUser(userInput:any){
      this.reviewer=new User().deserialize(userInput);
      return this;
    }
    
    
}
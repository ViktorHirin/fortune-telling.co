import {Deserializable} from "./deserializable.model";
import {User} from './user';
export class Ticket  implements Deserializable{
    name:String;
    subject:User;
    description:String;
    phone:String;
    email:String;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
}
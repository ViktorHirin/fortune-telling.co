import {Deserializable} from "./deserializable.model";
export class Notification implements Deserializable {
    _id: String;
    date:Date;
    from:String;
    action:String;
    imageUrl:String;
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      };
}
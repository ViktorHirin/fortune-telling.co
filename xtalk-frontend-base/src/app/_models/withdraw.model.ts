import {Deserializable} from "./deserializable.model";
export class WithDraw implements Deserializable {
    _id:string;
    id:string;
    createAt:Date;
    updateAt:Date;
    amount:number;
    status:string;
    userId:string;
    token:number;
    rate:number;
    deserialize(input: any) {
        Object.assign(this, input);
        this.id=input._id;
        return this;
      }
}
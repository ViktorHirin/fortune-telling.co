import {Deserializable} from "./deserializable.model";
export class Model  implements Deserializable{
    id: String;
    orientation:String;
    doNotDisturb:Boolean;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    description:string;
    interests : String;
    specialities : String;
    address:JSON;
    avatarUrl:string;
    role:string;
    almbum:JSON;
    rating:number;
    access_token:string;
    twilioNumber:string;
    phone:string;
    languages:string;
    location:any;
    service:string;
    gender:string;    
    about:string;
    age:Number;
    audioUrl:string;
    interersts:string;
    status:Boolean;
    isCalling:Boolean=false;
    isActive:Boolean;
    getAge () {
        return this.age || 20;
    }    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
      }
  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
    
}
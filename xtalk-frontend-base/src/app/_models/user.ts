import {Deserializable} from "./deserializable.model";
export class User implements Deserializable {
    id: string;
    orientation:String;
    isCalling:Boolean=false;
    category:string;
    social:Object;
    email:string;
    displayName:string;
    avatarUrl:string;
    avatar:any;
    wallImage:string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    token: number;
    avartarUri:string;
    access_token:String;
    twilioNumber:String;
    phone:{};
    languages:String;
    location:any={
      city:'',
      country:''
    };
    service:String;
    gender:String;    
    about:String;
    age:Number;
    role:String;
    audioUrl:String;
    interersts:String;
    specialities:String;
    status:Boolean;
    isActive:Boolean;
    interests:string;
    rating:number;
    avatarPath:string;
    doNotDisturb:Boolean=false;
    getAge () {
      return this.age || 20;
     }    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
    getFullName() {
      return this.firstName + ' ' + this.lastName || '';
    }

}
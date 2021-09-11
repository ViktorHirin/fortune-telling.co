import {Deserializable} from "./deserializable.model";

export class Alert implements Deserializable{
    id:string;
    type:AlertType;
    message:string;
    autoClose:boolean;
    keepAfterRouteChange: boolean;
    fade: boolean;
    constructor(init?:Partial<Alert>){
        Object.assign(this,init);
    }
    deserialize(input:any){
        Object.assign(this,input);
        return this;
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}
import {Deserializable} from "./deserializable.model";
import { environment } from '../../environments/environment';

export class Ads implements Deserializable {
    _id: String;
    header:any[]=[];
    footer:any[]=[];

  deserialize(input: any) {
    Object.assign(this, JSON.parse(input));
    return this;
  };
}
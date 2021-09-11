import {Deserializable} from "./deserializable.model";
import { environment } from '../../environments/environment';
export class Config implements Deserializable {
    _id: String;
    price:Number;
    footer:String;
    logo:object;
    faviconLink:string;
    fb:String;
    gg:String;
    twitter:String;
    headerAds:String;
    footerAds:String;
    googleCode:string;
    currency:string;
    getLogo(){
      if(this.logo)
      {
            return environment.apiUrl+'/'+this.logo['data'];            
      }
      else
       {
           return 'https://api.xmarketplace.net/uploads/logo/5f2405677d7a63270c5e98a6/logo.jpg'; 
       }

    }
    deserialize(input: any) {
        if(input)
        {
          Object.assign(this, JSON.parse(input));
          return this;
        }
        else
        {
          return null;
        }
      };
}
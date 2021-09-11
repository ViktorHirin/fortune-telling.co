import { User } from './user';
import {IGallery} from './Interface/IGallery';

export class Gallery implements IGallery{
    title: string;
    fileUrlBase:string;
    createAt:Date;
    updateAt:Date;
    _id:string;
    user:User;
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
  }
  
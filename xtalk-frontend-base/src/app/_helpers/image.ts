import { Injectable } from '@angular/core';
import {environment} from 'environments/environment';
@Injectable()
export class ImageHelper {
    private apiUrl=environment.apiUrl;
    private _validImageExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"]; 
    constructor() {}
    getAvatarLink(avatarPath:string="assets/images/img.png",type:string='medium')
    {
        let imageHeight:number,imageWidth:number;
        switch(type)
            {
            case 'thumbnail':
                imageHeight=environment.imageSize.thumbnail.height;
                imageWidth=environment.imageSize.thumbnail.width;
                break;
            case 'medium':
                imageHeight=environment.imageSize.medium.height;
                imageWidth=environment.imageSize.medium.width;
                break;
            case 'big':
                imageHeight=environment.imageSize.big.height;
                imageWidth=environment.imageSize.big.width;
                break;
            }
            let avatarArray=avatarPath.split('/');
            let nameImage=avatarArray[avatarArray.length-1];
            nameImage=imageWidth+'x'+imageHeight+'_'+nameImage;
            avatarArray[avatarArray.length-1]=nameImage;
            return this.apiUrl+'/'+avatarArray.join('/');
        
    }
    getAvatarLinkV2(user,avatarPath:string="assets/images/img.png",type:string='medium')
    {
        if(user.hasAvatar){
          return this.getAvatarLink(avatarPath,type);
        }
        return  user.avatarUrl;
        
    }

    isImage(oInput) {
        if (oInput.type.    match(/image\/*/)) {
            var sFileName = oInput.name;
             if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < this._validImageExtensions.length; j++) {
                    var sCurExtension = this._validImageExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                 
                if (!blnValid) {
                    let message=sFileName+" is invalid, allowed extensions are: " + this._validImageExtensions.join(", ");
                    return {
                        valid:false,
                        message:message
                    };
                }
                else
                {
                    return {
                        valid:true,
                    };
                }
            }
        }
        else
        {
            let message=oInput.name+" is not image"
                    return {
                        valid:false,
                        message:message
                    };
        }
    } 

    base64ToFile(data, filename) {

        const arr = data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
    
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
    
        return new File([u8arr], filename, { type: mime });
      }
    


}


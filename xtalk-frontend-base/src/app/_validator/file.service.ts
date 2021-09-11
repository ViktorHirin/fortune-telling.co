import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  
  isImage(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'gif':
      case 'bmp':
      case 'png':
        //etc
        return true;
    }
    return false;
  }
  
  isVideo(filename) {
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'm4v':
      case 'avi':
      case 'mpg':
      case 'mp4':
        // etc
        return true;
    }
    return false;
  }

  isAudio(filename){
    var ext = this.getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'mp3':
      case 'm4a':
      case 'midi':
      case 'm4b':
        // etc
        return true;
    }
    return false;
  }
  
}

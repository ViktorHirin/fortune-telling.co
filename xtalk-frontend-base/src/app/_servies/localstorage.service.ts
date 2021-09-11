import {Injectable,PLATFORM_ID,Inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
class LocalStorage implements Storage {
  [name: string]: any;
  readonly length: number;
  clear(): void {}
  getItem(key: string): string | null {return undefined;}
  key(index: number): string | null {return undefined;}
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}


@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements Storage {
  static isBrowser= new BehaviorSubject<boolean>(null);
  private storage: Storage;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.storage = new LocalStorage();

    if(isPlatformBrowser(platformId)) {
        this.storage = localStorage;
        LocalstorageService.isBrowser.next(isPlatformBrowser(platformId));
    };
  }

  [name: string]: any;

  length: number;

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }
}
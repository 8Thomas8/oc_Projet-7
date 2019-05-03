import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  //Save data in sessionStorage
  save(key, data) {
    sessionStorage.setItem(key, data);
  }

  //Read data in sessionStorage
  read(key) {
    const value = sessionStorage.getItem(key);
    return value;
  }

  //Remove data in sessionStorage
  remove(key) {
    sessionStorage.removeItem(key);
  }

  //Clear sessionStorage
  clear() {
    sessionStorage.clear();
  }
}

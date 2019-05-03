import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MapCenterService {

  private centerSource = new BehaviorSubject([]);
  currentCenter = this.centerSource.asObservable();

  constructor() { }

  //Change center values for the map
  changeCenter(selectedCenter: number[]) {
    this.centerSource.next(selectedCenter);
  }

}

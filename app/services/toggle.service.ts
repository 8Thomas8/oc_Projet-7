import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class ToggleService {
  // add - details - search
  private toggleStatutSource = new BehaviorSubject([false, false, false]);
  currentToggleStatut = this.toggleStatutSource.asObservable();

  constructor() { }

  //Change statut for add/detail/search menus
  changeToggle(toggleStatut: boolean[]) {
    this.toggleStatutSource.next(toggleStatut)
  }

}

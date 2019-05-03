import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from '../models/login';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  jsonConfigUrl = './assets/json/logins.json';

  //User statut
  private loginStatut = new BehaviorSubject(false);
  currentLoginStatut = this.loginStatut.asObservable();

  //User mail
  private userPseudo = new BehaviorSubject(null);
  currentUserPseudo = this.userPseudo.asObservable();
  

  constructor(private http: HttpClient) {
    this.checkSessionStorage();
   }

  //Retrieve data from json
  getData() {
    return this.http.get<Login[]>(this.jsonConfigUrl);
  }

  //Change login statut to true
  logIn() {
    this.loginStatut.next(true);
  }

  //Change login statut to false
  logOut() {
    this.loginStatut.next(false);
   }

  //Check data in sessionStorage
  checkSessionStorage() {
    if (sessionStorage['user']) {
      this.logIn();
      this.changeUserPseudo(sessionStorage['user']);
    }
  }

  //Change userPseudo
  changeUserPseudo(userPseudo: string) {
    this.userPseudo.next(userPseudo);
  }
}

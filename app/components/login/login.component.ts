import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Login } from '../../models/login';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() pseudoVal: string;
  @Input() passVal: string;
  @Input() mailVal: string;
  logins: Array<Login>;
  loginStatut: boolean;
  toggleRegister: boolean;

  // 0-9 a-z A-Z _
  regexPseudo = /[^=\w]+/g;
  // Contains 0-9 a-z A-Z _ @ 0-9 a-z A-Z _ .
  regexEmail = /.+@.\w+.\w+/g;
  // Contains 1 number, 1 uppercase, 1 lowercase, 1 special symbol (@#$%), 6-20 length
  regexPass = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/g;

  constructor(private loginService: LoginService, 
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit() {
    this.getLoginData();
  }

  // Verification login
  onLogIn() {
    if (!this.pseudoVal || !this.passVal) {
      alert("Données invalides") 
    } else {
      let loginsList = this.logins;
      let pseudo = this.pseudoVal;
      let pass = this.passVal;
      let key = "user";
      let data;
      let loginVerification = false;
      loginsList.forEach(function(login) {
        if ((pseudo === login['pseudo']) && (pass === login['pass'])) {
          loginVerification = true;
          data = [login['pseudo']];
        }
      });

    //Verify if user is already logged with sessionStorage
    if (loginVerification) {
      this.changeUserPseudo(this.pseudoVal);
      this.saveStorage(key, data);
      this.loginService.logIn();
    }

      //Naviguate to the route
      this.router.navigate(['']);
    }
  }

  //On register new account
  onNewLogIn() {
    let message: string;
    
    if (this.regexPass.test(this.passVal) == false ) { 
      message = "Le mot de passe ne contient pas au moins 1 de chaque caractères obligatoires (0-9, a-z, A-Z, @#$%) ou ne fait pas entre 6 et 20 de longueur.";
    }  

    if (this.regexEmail.test(this.mailVal) == false ) { 
      message = "Le mail n'est pas dans un format valide";
    }

    if (this.regexPseudo.test(this.pseudoVal) == true ) { 
      message = "Le pseudo contient des charactères non autorisés (a-z A-Z 0-9 _).";
    } 

    if (!this.pseudoVal || !this.passVal || !this.mailVal) {
      message = "Il manque des données";
    } 
    
    if (message) {
      alert(message);
      this.pseudoVal = "";
      this.mailVal = "";
      this.passVal = "";
    } else {
      this.logins.push({
        pseudo: this.pseudoVal,
        mail: this.mailVal,
        pass: this.passVal
      });

      let key = "user";
      let data = [this.pseudoVal];

      this.changeUserPseudo(this.pseudoVal);

      this.saveStorage(key, data);
      this.loginService.logIn();

      //Naviguate to route
      this.router.navigate(['']);
    }
  }

  //Get login data from json
  getLoginData() {
    this.loginService.getData()
    .subscribe(data => {
      this.logins = data
    });
  }

  //Get login sttaut from service
  getLoginStatut() {
   this.loginService.currentLoginStatut.subscribe(loginStatut => this.loginStatut = loginStatut);
  }

  //Save session storage
  saveStorage(key, data) {
    this.storageService.save(key, data);
  }

  //Manage witch form is activated
  manageToggleRegister() {
    if (this.toggleRegister) {
      this.toggleRegister = false;
    } else if (!this.toggleRegister) {
      this.toggleRegister = true;
    }
  }

  //Change user's pseudo in service
  changeUserPseudo(userPseudo) {
    this.loginService.changeUserPseudo(userPseudo);
  }
}

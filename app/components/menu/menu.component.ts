import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { StorageService } from '../../services/storage.service';
import { ToggleService } from '../../services/toggle.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss',
  '../../../../node_modules/font-awesome/css/font-awesome.css']
})
export class MenuComponent implements OnInit {
  loginStatut: boolean;
  toggleStatut: boolean[];
  userPseudo: string;

  constructor(private loginService: LoginService,
    private storageService: StorageService,
    private toggleService: ToggleService) { }

  ngOnInit() {
    this.closeAllToggle();
    this.eventListenerMenu();
    this.getLoginStatut();
    this.getToggle();
    this.getUserPseudo();
  }

  //Get login statut
  getLoginStatut() {
    this.loginService.currentLoginStatut.subscribe(loginStatut => this.loginStatut = loginStatut);
    if (this.loginStatut) {
      this.loginService.currentUserPseudo.subscribe(userPseudo => this.userPseudo = userPseudo);
    }
  }

  //Disconnect user
  disconnect() {
    this.loginService.logOut();
    this.storageService.clear();
  }

  //Send toggle statut to service
  sendToggle() {
    this.toggleService.changeToggle(this.toggleStatut);
  }

  //Get toggle statut from service
  getToggle() {
    this.toggleService.currentToggleStatut.subscribe(toggleStatut => this.toggleStatut = toggleStatut);
  }
  
  //Toggle search menu
  toggleSearch() {
    if (!this.toggleStatut[2]) {
      this.toggleStatut = [false, false, true];
      this.sendToggle();
    } else if (this.toggleStatut[2]) {
      this.toggleStatut = [false, false, false];
      this.sendToggle();
    }
  }

  //Close all toggles
  closeAllToggle() {
    this.toggleStatut = [false, false, false];
    this.sendToggle();
  }

  //Events listener
  eventListenerMenu() {
    document.getElementById('wrappedNav').addEventListener('click', function() {
      document.getElementById('miniNav').classList.toggle('miniNavActive');
    });

    let eltsIds = ['searchMiniButton', 'closeButton', 'firstPageButton', 'logButtons'];

    eltsIds.forEach(function(elt) {
      document.getElementById(elt).addEventListener('click', function() {
        document.getElementById('miniNav').classList.remove('miniNavActive');
      });
    });
  }

  getUserPseudo() {
    this.loginService.currentUserPseudo.subscribe(userPseudo => this.userPseudo = userPseudo);
  }

}

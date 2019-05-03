import { Component, OnInit } from '@angular/core';
import { ToggleService } from '../../services/toggle.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  toggleStatut: boolean[];
  loginStatut: boolean;

  constructor(
    private toggleService: ToggleService,
    private loginService: LoginService
    ) { }

  ngOnInit() {
    this.getToggle();
    this.getLoginStatut();
  }

  //Get toggles from service
  getToggle() {
    this.toggleService.currentToggleStatut.subscribe(toggleStatut => this.toggleStatut = toggleStatut);
  }

  //Get login statut from service
  getLoginStatut() {
    this.loginService.currentLoginStatut.subscribe(loginStatut => this.loginStatut = loginStatut);
  }
}

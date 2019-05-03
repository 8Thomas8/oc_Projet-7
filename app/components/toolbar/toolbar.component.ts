import { Component, OnInit, Input } from '@angular/core';
import { RestaurantsService } from '../../services/restaurants.service';
import { ToggleService } from '../../services/toggle.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss',
  '../../../../node_modules/font-awesome/css/font-awesome.css']
})
export class ToolbarComponent implements OnInit {
  maxFilter: number;
  minFilter: number;
  @Input() loginStatut: boolean;
  filterValue: number[];
  toggleStatut: boolean[];


  constructor(private restaurantsService: RestaurantsService,
    private toggleService: ToggleService) { }

  ngOnInit() {
    this.getToggle();
    this.leftButtonAnim();
    this.eventListenerFilter();
  }

  //Apply filter
  applyFilter() {
    let message: string;

    if (!this.minFilter || !this.maxFilter || this.minFilter < 1 || this.maxFilter < 1 || this.minFilter > 5 || this.maxFilter > 5) {
      message = 'Les données du filtre son invalides';
    }

    if (this.maxFilter < this.minFilter) {
      message = 'La valeur maximale du filtre ne peut pas être inférieure à la valeur minimale.';
    } 
    
    if (message) {
      alert(message);
      this.resetFilter();
    } else {
      this.filterValue = [this.minFilter, this.maxFilter];
      this.sendFilter();
      this.restaurantsService.filterList();
    }
  }

  //Reset filter
  resetFilter() {
    this.minFilter = null;
    this.maxFilter = null;
    this.filterValue = [this.minFilter, this.maxFilter];
    this.sendFilter();
    this.restaurantsService.filterList();
  }

  //Send filter to service
  sendFilter() {
    this.restaurantsService.changeFilter(this.filterValue);
  }
  
  //Manage toggle for add restaurant menu
  toggleAddRestaurant() {
    if (!this.toggleStatut[0]) {
      this.toggleStatut = [true, false, false];
      this.sendToggle();
    } else if (this.toggleStatut[0]) {
      this.toggleStatut = [false, false, false];;
      this.sendToggle();
    }
  }

  //Get toggles statut from service
  getToggle() {
    this.toggleService.currentToggleStatut.subscribe(toggleStatut => this.toggleStatut = toggleStatut);
  }

  //Send toggles statut to service
  sendToggle() {
    this.toggleService.changeToggle(this.toggleStatut);
  }

  //Add button animation
  leftButtonAnim() {
    document.getElementById('left').addEventListener('mouseover', function () {
      document.getElementById('addText').style.display = 'inline-block';
    });

    document.getElementById('left').addEventListener('mouseout', function () {
      document.getElementById('addText').style.display = 'none';
    });
  }

  //Events listener filter
  eventListenerFilter() {
    let eltsId = ['buttonFilter', 'okButton', 'resetButton'];

    eltsId.forEach(function (elt) {
      document.getElementById(elt).addEventListener('click', function() {
        document.getElementById('filter').classList.toggle('miniFilterActive');
      });
    });
  }
  
}

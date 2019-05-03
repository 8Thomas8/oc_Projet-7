import { Component, OnInit, Input } from '@angular/core';
import { RestaurantsService } from '../../../services/restaurants.service';
import { Restaurant } from '../../../models/restaurant';
import { ToggleService } from '../../../services/toggle.service';
import { MapCenterService } from '../../../services/map-center.service';

@Component({
  selector: 'app-search-restaurant',
  templateUrl: './search-restaurant.component.html',
  styleUrls: ['./search-restaurant.component.scss',
  '../../../../../node_modules/font-awesome/css/font-awesome.css']
})
export class SearchRestaurantComponent implements OnInit {
  restaurants: Array<Restaurant>;
  @Input() nameVal: string;
  @Input() addressVal: string;
  selectedRestaurant = null;
  selectedCenter: number[];
  modifiedZoom: number = 18;
  toggleStatut: boolean[];

  constructor(private restaurantsService: RestaurantsService,
    private toggleService: ToggleService,
    private mapCenterService: MapCenterService) { }

  ngOnInit() {
    this.restaurantsService.currentRestaurantList.subscribe(restaurants => this.restaurants = restaurants);
  }

  // Do search by name
  search() {
    let restaurantsList = this.restaurants;
    let result;

    if (this.nameVal && !this.addressVal) {
    let value = this.nameVal;

    restaurantsList.forEach(function(restaurant){
      if (value === restaurant['restaurantName']) {
        result = restaurant;
      }
    });

    this.selectedRestaurant = result;
    this.nameVal = "";
  } 
  
  if (this.addressVal && !this.nameVal) {
    let value = this.addressVal;

    restaurantsList.forEach(function(restaurant){
      if (value === restaurant['address']) {
        result = restaurant;
      }
    });

    this.selectedRestaurant = result;
    this.addressVal = "";
  } 

  if (this.selectedRestaurant) {
      this.sendRestaurant();
      this.selectedCenter = [this.selectedRestaurant['lat'], this.selectedRestaurant['long'], this.modifiedZoom];
      this.sendCenter();
      this.openToggle();
      this.sendToggle();
    } else {
      document.getElementById('searchError').style.display = 'block';
    }
  }

  //Update center in service
  sendCenter() {
    this.mapCenterService.changeCenter(this.selectedCenter);
  }

  //Update selected restaurant in service
  sendRestaurant() {
    this.restaurantsService.changeSelectedRestaurant(this.selectedRestaurant);
  }

  //Update toggles in service
  sendToggle() {
    this.toggleService.changeToggle(this.toggleStatut);
  }

  //Open toggle
  openToggle() {
    this.toggleStatut = [false, true, false];
    this.sendToggle();
  }

  //Close all toggles
  closeToggle() {
    this.toggleStatut = [false , false, false];
    this.sendToggle();
}

}

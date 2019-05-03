import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../../models/restaurant';
import { MapCenterService } from '../../../services/map-center.service';
import { RestaurantsService } from '../../../services/restaurants.service';
import { ToggleService } from '../../../services/toggle.service';

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.component.html',
  styleUrls: ['./list-restaurants.component.scss']
})
export class ListRestaurantsComponent implements OnInit {
  restaurants: Array<Restaurant>;
  filterValue: number[];
  selectedRestaurant: Restaurant[];
  selectedCenter: number[];
  modifiedZoom: number = 18;
  toggleStatut: boolean[];

  constructor(private mapCenterService: MapCenterService,
    private restaurantsService: RestaurantsService,
    private toggleService: ToggleService
    ) { }

  ngOnInit() {
    this.restaurantsService.currentRestaurantListFiltered.subscribe(restaurants => this.restaurants = restaurants);
    this.getToggle();
  }

  //Actions when 1 restaurant is selected by click
  onSelect(restaurant: Array<Restaurant>) {
    this.selectedCenter = [restaurant['lat'], restaurant['long'], this.modifiedZoom];
    this.selectedRestaurant = restaurant;
    this.sendCenter();
    this.sendSelectedRestaurant();
    this.openToggle();
  }

  //Update center data to service
  sendCenter() {
    this.mapCenterService.changeCenter(this.selectedCenter);
  }

  //Update selected restaurant in service
  sendSelectedRestaurant() {
    this.restaurantsService.changeSelectedRestaurant(this.selectedRestaurant);
  }

  //Manage toggles
  openToggle() {
    if (!this.toggleStatut[1]) {
      this.toggleStatut = [false, true, false];
    }
    this.sendToggle();
  }

  //Get toggles from service
  getToggle() {
    this.toggleService.currentToggleStatut.subscribe(toggleStatut => this.toggleStatut = toggleStatut);
  }

  //Update toggles in service
  sendToggle() {
    this.toggleService.changeToggle(this.toggleStatut);
  }

  //Methods for restaurant list navigation
  leftScroll() {
    let scrollElt = document.getElementsByClassName('restInfoBg');
    let scrolledElt = document.getElementById('restCarousel');
    scrolledElt.scrollLeft -= (scrollElt.item(0).clientWidth);
  }

  rightScroll() {
    let scrollElt = document.getElementsByClassName('restInfoBg');
    let scrolledElt = document.getElementById('restCarousel'); 
    scrolledElt.scrollLeft += (scrollElt.item(0).clientWidth);
  }

}

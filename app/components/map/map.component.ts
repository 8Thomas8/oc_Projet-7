import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Restaurant } from '../../models/restaurant';
import { MapCenterService } from '../../services/map-center.service';
import { RestaurantsService } from '../../services/restaurants.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss',
  '../../../../node_modules/font-awesome/css/font-awesome.css']
})

export class MapComponent implements OnInit {
  restaurants: Array<Restaurant>;
  filteredRestaurants: Array<Restaurant>;
  filterValue: number[];
  restaurantIcon = "../../assets/img/restaurant-32.png";
  selectedRestaurant: Restaurant[];

  userLat: number;
  userLng:  number;
  userInfoWindow: string;
  
  selectedCenter: number[];
  mapCenterLat: number;
  mapCenterLng: number;
  changeCenterLat: number;
  changeCenterLng: number;
  initialZoom: number = 16; 

  newRestaurantCoords: number[];

  constructor(private mapCenterService: MapCenterService,
    private restaurantsService: RestaurantsService) {
    //Check if geolocation is activated
    if (navigator.geolocation) {
      //Get user location
      navigator.geolocation.getCurrentPosition( pos => {
        this.userLat = +pos.coords.latitude;
        this.userLng = +pos.coords.longitude;
        this.selectedCenter = [this.userLat, this.userLng, this.initialZoom];
        this.mapCenterLat = this.selectedCenter[0];
        this.mapCenterLng = this.selectedCenter[1];
        this.initialZoom = this.selectedCenter[2];  
        this.userInfoWindow = "Tu es ici !";
      });
    } 
   }

  ngOnInit() {
    this.getCenter();
    this.getRestaurantsList();
   }

  //Get restaurants list
  getRestaurantsList() {
    this.restaurantsService.currentRestaurantListFiltered.subscribe(restaurants => this.restaurants = restaurants);
  }

  //Get map center
  getCenter() {
    this.mapCenterService.currentCenter.subscribe(selectedCenter => this.selectedCenter = selectedCenter);
  }

  //Get coords for new restaurant
  placeRestaurant($event){
    this.newRestaurantCoords = [$event.coords.lat, $event.coords.lng];
    this.sendNewRestaurantCoords();
  }

  //Send new restaurant coords to service
  sendNewRestaurantCoords() {
    this.restaurantsService.changeNewRestaurantCoords(this.newRestaurantCoords);
  }

  //Reset center on the user
  resetCenter() {
    this.selectedCenter = [this.userLat, this.userLng, this.initialZoom];
    this.sendCenter();
  }

  sendCenter() {
    this.mapCenterService.changeCenter(this.selectedCenter);
  }

  //Update center in service, on dragging when idle
  setCenterWhenIdle() {
    if (this.changeCenterLat && this.changeCenterLng) {
     this.selectedCenter = [this.changeCenterLat, this.changeCenterLng, null];
     this.sendCenter();
    }
  }

  //Track change center
  centerChange(event: any) {
    if (event) {
      this.changeCenterLat = event.lat;
      this.changeCenterLng = event.lng;
    }
  }
  
}

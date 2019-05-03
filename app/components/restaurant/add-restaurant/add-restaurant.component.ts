import { Component, OnInit, Input } from '@angular/core';
import { RestaurantsService } from '../../../services/restaurants.service';
import { Restaurant } from '../../../models/restaurant';
import { ToggleService } from '../../../services/toggle.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.scss',
  '../../../../../node_modules/font-awesome/css/font-awesome.css']
})
export class AddRestaurantComponent implements OnInit {
  restaurants: Array<Restaurant>;
  @Input() nameVal: string;
  @Input() addressVal: string;
  @Input() typeVal: string;
  @Input() latVal: number;
  @Input() longVal: number;
  @Input() starsVal: number;
  @Input() commentVal: string;
  newRestaurantCoords: number[] = null;
  toggleStatut: boolean[];
  regexLat =  /-?\d.+\d/;
  regexLong =  /-?\d.+\d/;
  regexStars = /[1-5]/;

  constructor(private restaurantsService: RestaurantsService,
    private toggleService: ToggleService) { 
  }

  ngOnInit() {
    this.sendNewRestaurantCoords();
    this.restaurantsService.currentRestaurantList.subscribe(restaurants => this.restaurants = restaurants);
    this.restaurantsService.currentNewRestaurantCoords.subscribe(newRestaurantCoords => this.newRestaurantCoords = newRestaurantCoords);
  }

  //Add the new restaurant values in the restaurant list
  onAdd() {
    let message: string;

    if (!this.nameVal || !this.addressVal || !this.typeVal || !this.latVal || !this.longVal || !this.starsVal || !this.commentVal ) {
      message = "Données invalides";
    }

    if (this.regexStars.test(this.convertNbToStr(this.starsVal)) == false) {
      message = 'Note invalide.';
    }

    if (this.regexLong.test(this.convertNbToStr(this.longVal)) == false){
      message = 'Longitude invalide.';
    } 

    if (this.regexLat.test(this.convertNbToStr(this.latVal)) == false ) {
      message = 'Latitude invalide.';
    } 
    
    if (message) {
      alert(message);
      this.resetInputVal();   
    } else {
      let newRestaurant = new Restaurant;
      
      newRestaurant = {
        restaurantName: this.nameVal,
        address: this.addressVal,
        type: this.typeVal,
        lat: this.latVal,
        long: this.longVal,
        averageRating: this.starsVal,
        ratings:
            [
              {
            stars: this.starsVal,
            comment: this.commentVal
          }
        ],
        streetview: this.restaurantsService.getStreetView(this.latVal, this.longVal)
      };

      this.restaurants.push(newRestaurant);
      this.sendRestaurantList();

      this.resetInputVal();

      this.newRestaurantCoords = null;
      this.sendNewRestaurantCoords();
      this.closeToggle();
      this.sendToggle();
    }
  }

  //Reset data in forms
  resetInputVal() {
    this.nameVal = "";
    this.addressVal = "";
    this.typeVal = "";
    this.starsVal = undefined;
    this.commentVal = "";
  }

  //Convert numbers into strings
  convertNbToStr(nb) {
    let str = "" + nb + "";
    return str;
  }

  //Change the restaurant list in the service
  sendRestaurantList() {
    this.restaurantsService.changeRestaurantList(this.restaurants);
  }

  //Check if there are selected coords
  checkNewRestaurantCoords() {
    if (!this.newRestaurantCoords) {
      return false;
    } else {
      this.setNewRestaurantCoords();
      return true;
    }
  }

  //Set the selected coords
  setNewRestaurantCoords() {
    this.latVal = this.newRestaurantCoords[0];
    this.longVal = this.newRestaurantCoords[1];
  }

  //Change the coords for new restaurant in the service
  sendNewRestaurantCoords() {
   this.restaurantsService.changeNewRestaurantCoords(this.newRestaurantCoords);
  }

  //Close all toggles
  closeToggle() {
    this.toggleStatut = [false , false, false];
    this.sendToggle();
}

  //Update toggles in service
  sendToggle() {
    this.toggleService.changeToggle(this.toggleStatut);
  }

}

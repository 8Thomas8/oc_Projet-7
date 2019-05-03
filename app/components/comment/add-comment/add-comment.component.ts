import { Component, OnInit, Input } from '@angular/core';
import { Restaurant } from '../../../models/restaurant';
import { RestaurantsService } from '../../../services/restaurants.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent implements OnInit {
  selectedRestaurant;
  restaurants: Array<Restaurant>;
  @Input() commentVal: string;
  @Input() starsVal: number;
  indexOfRestaurant: number;

  constructor(private restaurantsService: RestaurantsService,
    private router: Router) { }

  ngOnInit() {
    this.getRestaurantsList();
    this.getSelectedRestaurant();
  }

  // Call all methods for editing the restaurant list
  onAdd() {
    if (this.commentVal && this.starsVal) {
    this.removeFromArray();
    this.editSelection();
    this.pushToArray();
    //Change restaurant list in the service
    this.sendRestaurantList();
     this.router.navigateByUrl('/');
   } else {
     alert('Il manque des informations');
    }
  }

  //Remove restaurant from restaurant list
  removeFromArray() {
    let restaurantsList = this.restaurants;
    let selectedRestaurantName = this.selectedRestaurant['restaurantName'];
    for (let i = 0; i < this.restaurants.length; i++) {
       if (restaurantsList[i]['restaurantName'] === selectedRestaurantName) {
         this.indexOfRestaurant = i;
       }
    }
    this.restaurants.splice(this.indexOfRestaurant, 1);
  }

  //Edit restaurant
  editSelection() {
    let ratings = this.selectedRestaurant['ratings'];
    ratings.push({
      stars: this.starsVal,
      comment: this.commentVal
    });
  }

  //Push restaurant in restaurant list
  pushToArray() {
    this.restaurants.splice(this.indexOfRestaurant, 0, this.selectedRestaurant);
  }

  //Get the selected restaurant from the service
  getSelectedRestaurant() {
    this.restaurantsService.currentRestaurant.subscribe(data => this.selectedRestaurant = data);
  }

  //Get restaurants list from the service
  getRestaurantsList() {
    this.restaurantsService.currentRestaurantList.subscribe(restaurants => this.restaurants = restaurants);
  }

  //Send restaurants list to service
  sendRestaurantList() {
   this.restaurantsService.changeRestaurantList(this.restaurants); 
  }

}
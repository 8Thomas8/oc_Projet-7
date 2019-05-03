import { Component, OnInit, Input } from '@angular/core';
import { ToggleService } from '../../../services/toggle.service';
import { RestaurantsService } from '../../../services/restaurants.service';
import { Restaurant } from '../../../models/restaurant';

@Component({
  selector: 'app-details-restaurant',
  templateUrl: './details-restaurant.component.html',
  styleUrls: ['./details-restaurant.component.scss',
  '../../../../../node_modules/font-awesome/css/font-awesome.css']
})
export class DetailsRestaurantComponent implements OnInit {
  toggleStatut: boolean[];
  selectedRestaurant: Restaurant[];
  @Input() loginStatut: boolean;

  constructor(private toggleService: ToggleService,
    private restaurantsService: RestaurantsService) { 
    }

  ngOnInit() {
    this.getSelectedRestaurant();
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

  //Get slected restaurant in service
  getSelectedRestaurant() {
    this.restaurantsService.currentRestaurant.subscribe(data => this.selectedRestaurant = data);
  }

}

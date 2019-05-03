import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Restaurant } from '../models/restaurant';
import { Rating } from '../models/rating';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MapsAPILoader } from '@agm/core';

declare var google; //Parfois, ERROR ReferenceError: google is not defined (surtout sur Chrome);

@Injectable()
export class RestaurantsService {
  jsonConfigUrl = '../../assets/json/restaurantsList.json';

  apiConfigUrl: string;
  userLat: number;
  userLng: number;

  restaurantsData: Restaurant[];
  
  //User coords
  private userLatSource = new BehaviorSubject(null);
  currentUserLat = this.userLatSource.asObservable();
  private userLngSource = new BehaviorSubject(null);
  currentUserLng = this.userLngSource.asObservable();
  
  //Restaurants list without filter
  private restaurantListSource = new BehaviorSubject([]);
  currentRestaurantList = this.restaurantListSource.asObservable();

  //Restaurants list filtered
  private restaurantListFilteredSource = new BehaviorSubject([]);
  currentRestaurantListFiltered = this.restaurantListFilteredSource.asObservable();

  //Selected restaurant
  private restaurantSource = new BehaviorSubject([]);
  currentRestaurant = this.restaurantSource.asObservable();

  //Coords for new restaurant
  private newRestaurantCoordsSource = new BehaviorSubject(null);
  currentNewRestaurantCoords = this.newRestaurantCoordsSource.asObservable();

  //Filter values
  private filterValueSource = new BehaviorSubject(null);
  currentValueFilter = this.filterValueSource.asObservable();

  constructor(private http: HttpClient, private mapsAPILoader: MapsAPILoader) {
    this.getRestaurantList();
  }

  //Get restaurant list & change value for restaurantListSource
  getRestaurantList() {
    if (navigator.geolocation) {
      //get user location
      navigator.geolocation.getCurrentPosition( pos => {
        this.userLatSource.next(pos.coords.latitude),
        this.userLngSource.next(pos.coords.longitude),
        this.getRestaurantsFromApi();
      });
    }
  }

  //Get restaurants from api
  getRestaurantsFromApi() {
    var location = new google.maps.LatLng(this.userLatSource.getValue(),this.userLngSource.getValue());

    this.mapsAPILoader.load().then(() => {
      let serviceRestaurants = new google.maps.places.PlacesService(document.createElement('div'));
      serviceRestaurants.nearbySearch({
        location: location,
        radius: '2000',
        type: ['restaurant']
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.formatResults(results);
        }
      });
    });
  }

  //Format results from api
  formatResults(results) {
    let restaurantsList = [];
    let type: string;
    let typeFormated: string;
    let nameFormated: string;

    for (let i = 0; i < results.length; i++) {
      let restaurantFormated = new Restaurant;

      //Format restaurant type
      typeFormated = "";
      type = results[i]['types'][0];
      if (type === "meal_delivery") {
        typeFormated = "Livraison";
      } else if (type === "bar") {
        typeFormated = "Bar Restaurant";
      } else {
        typeFormated = "Restaurant";
      }

      //Format restaurant name
      nameFormated = "";
      if (results[i]['name'].length > 20) {
        for (let j = 0; j <= 20; j++) {
          nameFormated += results[i]['name'][j];
        }
        nameFormated += "...";
      } else {
        nameFormated = results[i]['name'];
      }

      restaurantFormated = {
        id: results[i]['place_id'],
        restaurantName: nameFormated,
        address: results[i]['vicinity'],
        type: typeFormated,
        lat: results[i]['geometry'].location.lat(),
        long: results[i]['geometry'].location.lng(),
        averageRating: results[i]['rating'],
        ratings: []
      };
      
      restaurantsList.push(restaurantFormated);
    }

    this.restaurantsData = restaurantsList;
    this.getStreetViews(this.restaurantsData);
  }

  //Get streetviews images for each restaurants
  getStreetViews(restaurantsList) {
    let selectedRestaurant;
    let imgStreetView: string;
    restaurantsList.forEach(function(restaurant) {
      let lat = restaurant['lat'];
      let long = restaurant['long'];
      selectedRestaurant = restaurant;
      imgStreetView = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + long + '&pitch=-0.76&key=' + environment.apiKey;
  
     
      selectedRestaurant['streetview'] = imgStreetView;
    });
  
    this.restaurantsData = restaurantsList;

    this.changeRestaurantList(this.restaurantsData);
    this.changeRestaurantListFiltered(this.restaurantsData);

    this.getDetailsFromApi(this.restaurantsData);
   }

   //Get details on selectedRestaurant
   getDetailsFromApi(restaurantsList) {
    for (let i = 0; i < restaurantsList.length; i++) {

      this.mapsAPILoader.load().then(() => {
        let serviceRestaurants = new google.maps.places.PlacesService(document.createElement('div'));
        serviceRestaurants.getDetails({
          placeId: restaurantsList[i]['id'],
          fields: ['formatted_address','geometry','reviews','types','vicinity','name']
        }, (detailsResults, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            let details = this.formatDetails(detailsResults);
            restaurantsList[i]['ratings'] = details;
            //Update restaurantsList
            this.updateRestaurantsLists(restaurantsList[i]);
          }
        });
      });

    }
   }

   //Format details from api
   formatDetails(detailsResults) {
    let reviews = detailsResults['reviews'];
    let ratings: Rating[] = [];
    for (var i = 0; i < reviews.length; i++) {
      let thisRating = {stars: 0, comment: null};
      thisRating.stars = detailsResults['reviews'][i].rating;
      thisRating.comment = detailsResults['reviews'][i].text;
      ratings.push(thisRating);
    }

    return ratings;
   }

  //Update restaurants lists with details
  updateRestaurantsLists(selectedRestaurant) {
    let restaurantsList = this.restaurantsData;
    restaurantsList.forEach(function(restaurant) {
    if (restaurant['id'] == selectedRestaurant['id']) {
      let indexOf = restaurantsList.indexOf(restaurant);
      restaurantsList.splice(indexOf, 1, restaurant);
    }
    });

    this.restaurantsData = restaurantsList;
     
    this.changeRestaurantList(this.restaurantsData);
    this.changeRestaurantListFiltered(this.restaurantsData);
  }

  //Get streetview image for new restaurant
  getStreetView(lat, long) {
    let imgStreetView = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + lat + ',' + long + '&pitch=-0.76&key=' + environment.apiKey;
   return imgStreetView;
  }

  //Apply filter and update restautants list filtered
  filterList() {
    let filter: number[];
    this.filterValueSource.subscribe(data => {
    filter = data
   });
    let restaurantsList: Restaurant[] = [];
  
    if (filter[0] == null && filter[1] == null) {
     restaurantsList = this.restaurantListSource.getValue();
     this.restaurantListFilteredSource.next(restaurantsList);
    } else if (!(filter == [null, null]) && (filter[0] <= filter[1])) {
      this.restaurantListSource.getValue().forEach(function(restaurant) {
       let averageRating: number;
       let ratingsStars: number = 0;
        restaurant['ratings'].forEach(function(rating) {
         ratingsStars += rating.stars;
       });
       averageRating = ratingsStars / restaurant['ratings'].length;
       if (averageRating >= filter[0] && averageRating <= filter[1]) {
          restaurantsList.push(restaurant);
       }
      });
    } 
    this.restaurantListFilteredSource.next(restaurantsList);
  }

  // Change the actual restaurant list
  changeRestaurantList(restaurants) {
   this.restaurantListSource.next(restaurants);
  }

  // Change the actual restaurant list filtered
  changeRestaurantListFiltered(restaurants) {
   this.restaurantListFilteredSource.next(restaurants);
  }


 // Change the actual selected restaurant
 changeSelectedRestaurant(selectedRestaurant: Array<Restaurant>) {
  this.restaurantSource.next(selectedRestaurant);
 }

 //Change coords for new restaurant
 changeNewRestaurantCoords(newRestaurantCoords: number[]) {
  this.newRestaurantCoordsSource.next(newRestaurantCoords)
  }
 
 //Change filter values
 changeFilter(filterValue: number[]) {
  this.filterValueSource.next(filterValue);
  }


}
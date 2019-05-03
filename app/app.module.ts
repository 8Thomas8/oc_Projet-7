// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
//Components
import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { MapComponent } from './components/map/map.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { ListRestaurantsComponent } from './components/restaurant/list-restaurants/list-restaurants.component';
import { SearchRestaurantComponent } from './components/restaurant/search-restaurant/search-restaurant.component';
import { AddRestaurantComponent } from './components/restaurant/add-restaurant/add-restaurant.component';
import { DetailsRestaurantComponent } from './components/restaurant/details-restaurant/details-restaurant.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CommentComponent } from './components/comment/comment.component';
import { AddCommentComponent } from './components/comment/add-comment/add-comment.component';
//Pipes
import { RatingPipe } from './pipes/rating.pipe';
//Services
import { MapCenterService } from './services/map-center.service';
import { RestaurantsService } from './services/restaurants.service';
import { LoginService } from './services/login.service';
import { ToggleService } from './services/toggle.service';
import { environment } from './../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MapComponent,
    AddRestaurantComponent,
    RestaurantComponent,
    ListRestaurantsComponent,
    SearchRestaurantComponent,
    DetailsRestaurantComponent,
    CommentComponent,
    AddCommentComponent,
    RatingPipe,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey,
      libraries: ["places"]
    }),
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [MapCenterService,
              RestaurantsService,
              LoginService,
              ToggleService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ratingPipe'})
export class RatingPipe implements PipeTransform {
  transform(value: any, args?: any):any{
    let maxRating = 5;
    let finalWidth: number;

    if (args == "averageStars") {
      let baseWidth = document.getElementById('bgAverageRating').offsetWidth;
      
      //Calc value for the rating div width
      finalWidth = baseWidth * (value / maxRating);

      return finalWidth + "px";
    } else if (args == "1rating") {
      let baseWidth = document.getElementById('bgRating').offsetWidth;
      let rating = value;

      //Calc value for the rating div width
      finalWidth = (baseWidth / maxRating) * rating;

      return finalWidth + "px";
    } else if (args == "infowindow") {
      let baseWidth = 53;

      //Calc value for the rating div width
      finalWidth = baseWidth * (value / maxRating);

      return finalWidth + "px";
    } 
  }
}
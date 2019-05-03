import { Rating } from '../models/rating';

//Model for Restaurant data
export class Restaurant {
  id?: number;
  restaurantName: string;
  address: string;
  type: string;
  lat: number;
  long: number;
  averageRating: number;
  ratings: Array<Rating>;
  streetview?: string;
}
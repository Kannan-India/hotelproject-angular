import { Review } from './Review';

export class Hotel {
  //always use string (not String)
  hotelId: string;
  hotelName: string;
  pricePerNight: number;
  address: Address;
  reviews: Review[];

  constructor() {
    this.hotelId = '';
    this.hotelName = '';
    this.pricePerNight = 0;
    this.address = new Address();
    this.reviews = [];
  }
}

class Address {
  city: string;
  country: string;
  constructor() {
    this.city = '';
    this.country = '';
  }
}

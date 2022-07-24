import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configuration } from './configuration';
import { HotelService } from './services/hotel.service';
import { Hotel } from './models/hotel';
import { Review } from './models/Review';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  hotel: Hotel; //Hotel hotel = new Hotel()
  hotels: Hotel[];
  review: Review;

  constructor(
    private httpCLient: HttpClient,
    private hotelService: HotelService
  ) {
    this.hotel = new Hotel();
    this.hotels = [];
    this.review = new Review();
  }

  ngOnInit(): void {
    this.fetchHotels();
  }

  reloadData() {
    this.hotel = new Hotel();
    this.review = new Review();
    this.fetchHotels();
  }

  fetchHotels() {
    this.hotelService.getHotels().subscribe(
      (data) => {
        this.hotels = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validateHotelData(): boolean {
    let flag = false;
    if (this.hotel.hotelId == '') {
      alert('Please enter a valid hotel Id');
    } else if (this.hotel.hotelName == '') {
      alert('Please enter a valid hotel Name');
    } else if (this.hotel.pricePerNight == 0) {
      alert('Please enter a valid price');
    } else if (this.hotel.address.city == '') {
      alert('Please enter a valid city');
    } else if (this.hotel.address.country == '') {
      alert('Please enter a valid country');
    } else {
      flag = true;
    }

    return flag;
  }

  onRegister() {
    if (this.validateHotelData()) {
      console.log('Checkpoint 1');
      //asynchronous vs synchronous programming
      this.hotelService.createHotel(this.hotel).subscribe(
        (data) => {
          if (data) {
            console.log('Checkpoint 3');
            //reload data since new record has been added
            this.reloadData();
          } else {
            alert(
              'Error while creating hotel. Please look onto the backend logs'
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
      console.log('Checkpoint 2');
    }
  }

  onUpdate() {
    if (this.validateHotelData()) {
      this.hotelService.updateHotel(this.hotel).subscribe(
        (data) => {
          if (data) {
            this.reloadData();
          } else {
            alert(
              'Error while updating hotel. Please look onto the backend logs'
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onDelete(id: string) {
    this.hotelService.deleteHotel(id).subscribe(
      (data) => {
        if (data) {
          this.reloadData();
        } else {
          alert(
            'Error while deleting hotel. Please look onto the backend logs'
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  validateReviewData(): boolean {
    let flag = false;
    if (this.review.userName == '') {
      alert('Please enter a valid user name');
    } else if (this.review.rating == 0) {
      alert('Please enter a valid rating');
    } else if (this.review.hotelId == '') {
      alert('Please enter a valid hotelId');
    } else {
      flag = true;
    }
    return flag;
  }

  onReview() {
    console.log('came to review');
    if (this.validateReviewData()) {
      console.log('validated');
      this.hotelService.createReview(this.review).subscribe(
        (data) => {
          if (data) {
            this.reloadData();
          } else {
            alert('Server error');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  /************************
   *************************
   updated code ends here
   ***********************
   ************************/

  public hotelsArray;

  hotelId = '';
  hotelName = '';
  price: number;
  city = '';
  country = '';

  userName = '';
  rating = '';
  hotelIdr = '';

  onRegisterOld() {
    const hotelObj = {
      id: this.hotelId,
      hotelName: this.hotelName,
      pricePerNight: this.price,
      address: {
        city: this.city,
        country: this.country,
      },
      reviews: [],
    };

    console.log('The posted Object is : ');
    console.log(hotelObj);
    this.httpCLient
      .post('http://localhost:8080/hotels', hotelObj)
      .toPromise()
      .then((data) => {
        console.log('The Received Object : ');
        console.log(data);

        this.httpCLient
          .get(`http://localhost:8080/hotels`)
          .toPromise()
          .then((data) => {
            this.hotelsArray = data;
            // console.log(data)
            this.resetFieldsRegister();
          });
      });
  }

  onUpdateOld() {
    this.httpCLient
      .get(`http://localhost:8080/hotels/${this.hotelId}`)
      .toPromise()
      .then((data) => {
        data['hotelName'] = this.hotelName;
        data['pricePerNight'] = this.price;
        data['address']['city'] = this.city;
        data['address']['country'] = this.country;

        console.log(data);

        this.httpCLient
          .put(`http://localhost:8080/hotels/`, data)
          .toPromise()
          .then((data) => {
            console.log('updated.!');
            console.log(data);

            this.httpCLient
              .get(`http://localhost:8080/hotels`)
              .toPromise()
              .then((data) => {
                this.hotelsArray = data;
                this.resetFieldsRegister();
              });
          });
      });
  }

  onReviewOld() {
    //creating review
    const reviewObj = {
      userName: this.userName,
      rating: this.rating,
      approved: true,
    };

    console.log('Requesting Hotel Object');
    this.httpCLient
      .get(`http://localhost:8080/hotels/${this.hotelIdr}`)
      .toPromise()
      .then((data) => {
        console.log('get request successful');

        data['reviews'].push(reviewObj);

        console.log('updating hotel object with the review');
        this.httpCLient
          .post('http://localhost:8080/hotels', data)
          .toPromise()
          .then((data) => {
            console.log('Update success. The Received Object : ');
            console.log(data);

            this.httpCLient
              .get(`http://localhost:8080/hotels`)
              .toPromise()
              .then((data) => {
                this.hotelsArray = data;
                console.log('Hotel array updated');
                // console.log(this.hotelsArray)
                this.resetFieldsReview();
              });
          });
      });
  }

  resetFieldsRegister() {
    this.hotelId = '';
    this.hotelName = '';
    this.price = null;
    this.city = '';
    this.country = '';
  }

  resetFieldsReview() {
    this.userName = '';
    this.rating = null;
    this.hotelIdr = '';
  }

  myObj = {
    id: '4',
    hotelName: 'Radisson Blu',
    pricePerNight: 4500,
    address: {
      city: 'Coimbatore',
      country: 'India',
    },
    reviews: [
      {
        userName: 'Kannan',
        rating: 4,
        approved: true,
      },
    ],
  };

  btnClicked() {
    this.httpCLient
      .post('http://localhost:8080/hotels', this.myObj)
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }

  // dynObj = [
  //   JSON.stringify(this.dynObj1)
  // ]

  // jsons = JSON.stringify(this.jsonm);

  jsonTemplate = {
    id: '3',
    hotelName: 'Radisson Blu',
    pricePerNight: 4500,
    address: {
      city: 'Coimbatore',
      country: 'India',
    },
    reviews: [
      {
        userName: 'Kannan',
        rating: 4,
        approved: true,
      },
    ],
  };
}

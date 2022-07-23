import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  constructor(private http: HttpClient) {}

  createHotel(hotel: Hotel): Observable<boolean> {
    return this.http.post<boolean>(`${Configuration.serverURL}hotels`, hotel);
  }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${Configuration.serverURL}hotels`);
  }

  updateHotel(hotel: Hotel): Observable<boolean> {
    return this.http.put<boolean>(`${Configuration.serverURL}hotels`, hotel);
  }

  deleteHotel(hotelId: string): Observable<boolean> {
    return this.http.delete<boolean>(
      `${Configuration.serverURL}hotels/${hotelId}`
    );
  }
}

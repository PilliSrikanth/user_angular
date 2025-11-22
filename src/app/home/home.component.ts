import { Component, OnInit } from '@angular/core';
import { HostelService } from '../hostel.service';
import { Router } from '@angular/router';

interface Hostel {
  _id: string;
  name: string;
  type: string;
  area: string;
  lat?: number; // latitude of hostel
  lng?: number; // longitude of hostel
  address?: string;
  image?: string;
  rating?: number;
  [key: string]: any;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentPlace: string = "Your Location";
  categories = ["boys", "girls", "room"];
  selectedCategory: string = "boys";

  hostels: Hostel[] = [];
  NearbyHostels: Hostel[] = [];
  topHostels: Hostel[] = [];

  searchText: string = '';

  userLat: number = 0;
  userLng: number = 0;

  constructor(private hostelService: HostelService, private router: Router) {}

  ngOnInit() {
    this.getLocation();
    this.loadAllHostels();
  }

  loadAllHostels() {
    this.hostelService.getAllHostels().subscribe((res: any) => {
      const allHostels = res.data || res;
      this.hostels = allHostels.filter((h: Hostel) => h.type === this.selectedCategory);
    });
  }

  // Calculate distance between two coordinates (Haversine formula)
  getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  deg2rad(deg: number) {
    return deg * (Math.PI/180);
  }

  getNearbyHostels(lat: number, lng: number) {
    this.userLat = lat;
    this.userLng = lng;

    this.hostelService.getNearby(lat, lng).subscribe((res: any) => {
      const nearby = res.data || res;
      // Filter by category + distance <= 5 km
      this.NearbyHostels = nearby.filter((h: Hostel) => 
        h.type === this.selectedCategory &&
        h.lat && h.lng &&
        this.getDistanceKm(lat, lng, h.lat, h.lng) <= 5
      );
    });
  }

  getNearbyTopRated(lat: number, lng: number) {
    this.hostelService.getNearbyTop(lat, lng).subscribe((res: any) => {
      const top = res.data || res;
      this.topHostels = top.filter((h: Hostel) => 
        h.type === this.selectedCategory &&
        h.lat && h.lng &&
        this.getDistanceKm(lat, lng, h.lat, h.lng) <= 5
      );
    });
  }

  filterByCategory(type: string) {
    this.selectedCategory = type;
    this.loadAllHostels();
    this.getNearbyHostels(this.userLat, this.userLng);
    this.getNearbyTopRated(this.userLat, this.userLng);
  }

  onSearch() {
    if (!this.searchText) {
      this.loadAllHostels();
      this.getNearbyHostels(this.userLat, this.userLng);
      this.getNearbyTopRated(this.userLat, this.userLng);
      return;
    }

    this.hostelService.searchHostelsByArea(this.searchText, this.selectedCategory).subscribe((res: any) => {
      this.NearbyHostels = [];
      this.topHostels = [];
      this.hostels = res.data || res;
    });
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        this.userLat = lat;
        this.userLng = lng;

        this.getNearbyHostels(lat, lng);
        this.getNearbyTopRated(lat, lng);

        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
          .then(r => r.json())
          .then(data => {
            this.currentPlace = data.locality || data.city || data.principalSubdivision || "Your Location";
            this.searchText = this.currentPlace;
          })
          .catch(err => console.error("Reverse geocode error:", err));
      },
      (err) => {
        console.error("Geolocation error:", err);
        this.currentPlace = "Your Location";
      },
      { enableHighAccuracy: true }
    );
  }

  openHostel(id: string) {
    this.router.navigate(['/hostel', id]);
  }

  
}

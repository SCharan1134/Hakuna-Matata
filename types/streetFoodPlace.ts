export interface StreetFoodPlace {
  id: number;
  createdAt: string;
  name: string;
  category: string; // Fixed typo from 'catergory' to 'category'
  address: string;
  landmark: string;
  latitude: number;
  longitude: number;
  created_by: string;
  uuid: string;
  type: string;
  opentime: string;
  closetime: string;
  review_count: number;
  like_count: number;
  review_star: number;
}
export interface PlaceType {
  id: number;
  createdAt: string;
  name: string;
  category: string; // Fixed typo from 'catergory' to 'category'
  address: string;
  landmark: string;
  latitude: number;
  longitude: number;
  created_by: string;
  uuid: string;
  type: string;
  opentime: string;
  closetime: string;
  review_count: number;
  like_count: number;
  review_star: number;
}

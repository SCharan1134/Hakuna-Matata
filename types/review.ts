export interface Review {
  id: number;
  created_at: string;
  place_id: number;
  user_id: number;
  images: string[];
  review: string;
  stars: number;
  profiles: User;
  uuid: string;
}

export interface User {
  id: number;
  name: string;
  avatar_url: string;
}

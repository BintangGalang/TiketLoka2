// src/types/index.ts

export interface Destination {
  id: number;
  name: string;
  location: string;
  image_url: string;
  price: number;
}

export interface BookingDetail {
  id: number;
  destination: Destination;
  quantity: number;
  visit_date: string;
  subtotal: number;
}

export interface Booking {
  id: number;
  booking_code: string;
  grand_total: number;
  status: 'pending' | 'success' | 'failed';
  payment_method: string;
  paid_at: string;
  qr_string: string; // Ini dari $appends di Model Laravel
  created_at: string;
  details: BookingDetail[];
}

export interface CartItem {
  id: number;
  user_id: number;
  destination_id: number;
  quantity: number;
  visit_date: string;
  total_price: number; // Ini dari $appends di Model Cart
  destination: Destination; // Relasi ke wisata
}
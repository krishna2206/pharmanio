export interface City {
  id: number;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string | null;
  phone: string[];
  latitude: number | null;
  longitude: number | null;
  city: City;
}

export interface DutyPeriod {
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface PharmacyResponse {
  duty_period: DutyPeriod;
  pharmacies: Pharmacy[];
  total_count: number;
  pharmacy_ids: number[];
}
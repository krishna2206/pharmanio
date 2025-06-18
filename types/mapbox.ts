export interface TravelEstimate {
  walkTime: number; // in minutes
  driveTime: number; // in minutes
  walkDistance: number; // in kilometers
  driveDistance: number; // in kilometers
}

export interface RouteStep {
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
  maneuver: {
    type: string;
    modifier?: string;
    bearing_after?: number;
    bearing_before?: number;
    location: [number, number];
  };
}

export interface RouteData {
  coordinates: number[][];
  distance: number; // in meters
  duration: number; // in seconds
  steps?: RouteStep[];
}

export interface MapboxGeocodingFeature {
  id: string;
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    mapbox_id: string;
    feature_type: string;
    name: string;
    name_preferred?: string;
    text?: string;
    place_name?: string;
    place_formatted: string;
    full_address?: string;
    coordinates: {
      longitude: number;
      latitude: number;
      accuracy?: string;
    };
    context: {
      address?: { name: string; address_number?: string; street_name?: string };
      street?: { name: string };
      neighborhood?: { name: string };
      postcode?: { name: string };
      place?: { name: string; wikidata_id?: string };
      district?: { name: string; wikidata_id?: string };
      region?: { name: string; region_code?: string; wikidata_id?: string };
      country?: { name: string; country_code?: string; wikidata_id?: string };
    };
  };
}

export interface MapboxGeocodingResponse {
  type: 'FeatureCollection';
  features: MapboxGeocodingFeature[];
  attribution: string;
}
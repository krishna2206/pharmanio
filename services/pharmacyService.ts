import type { PharmacyResponse } from '@/types/pharmacy';

export class PharmacyService {
  private static instance: PharmacyService;
  private baseUrl = process.env.EXPO_PUBLIC_API_URL;

  private constructor() {}

  static getInstance(): PharmacyService {
    if (!PharmacyService.instance) {
      PharmacyService.instance = new PharmacyService();
    }
    return PharmacyService.instance;
  }

  async getOnDutyPharmacies(): Promise<PharmacyResponse> {
    const response = await fetch(`${this.baseUrl}/on-duty`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
}

export const pharmacyService = PharmacyService.getInstance();
import { AxiosError } from "axios";
import apiClient from './api-client';
import { WeatherForecast } from './types';

// Fungsi forecast weather
export async function ForecastWeather(apiKey: string, city: string): Promise<WeatherForecast[]> {
  try {
    const res = await apiClient.get(
      `/weather/forecast?city=${encodeURIComponent(city)}`,
      {
        headers: {
          Authorization: `ApiKey ${apiKey}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Failed to fetch forecast weather';
    throw new Error(msg);
  }
}
  
import apiClient from './api-client';
import { TrainStation, TrainRoute } from './types';

// Fungsi list train
export async function ListTrain(apiKey: string, city: string = '', prefekture: string = ''): Promise<TrainStation[]> {
  try {
    const params = new URLSearchParams();

    if (city) params.append('city', city);
    if (prefekture) params.append('prefekture', prefekture);

    const res = await apiClient.get(
      `/train/list?${params.toString()}`,
      {
        headers: {
          'Authorization': `ApiKey ${apiKey}`
        }
      }
    );
    
    return res.data;
  } catch (error) {
    console.error("Error fetching train list:", error);
    throw error;
  }
}

// Fungsi schedule train
type TimeParameter = { hour: number; minute: number };

export async function ScheduleTrain(apiKey: string, from_station: string, to_station: string, date: Date, time: TimeParameter): Promise<TrainRoute[]> {
  const formattedDate = date.toISOString().split("T")[0];

  // Format jadi "HH:MM"
  const formattedTime = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;

  try {
    const res = await apiClient.get(`/train/schedule`, {
      params: {
        from_station,
        to_station,
        date: formattedDate,
        time: formattedTime,
      },
      headers: {
        Authorization: `ApiKey ${apiKey}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching schedule:", err);
    throw err;
  }
}

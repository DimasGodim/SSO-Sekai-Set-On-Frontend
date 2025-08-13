import { AxiosError } from "axios";
import apiClient from './api-client';
import { TTSCharacter, TTSResponse } from './types';

// Fungsi list characters
export async function ListCharacter(apiKey: string): Promise<TTSCharacter[]> {
  try {
    const res = await apiClient.get(
      `/tts/list_characters`,
      {
        headers: {
          Authorization: `ApiKey ${apiKey}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Failed to fetch character list.';
    throw new Error(msg);
  }
}

export async function ChangeTTS(apiKey: string, text: string, char: string, mode: string): Promise<TTSResponse> {
  try {
    const res = await apiClient.get(
      `/tts/change?text=${encodeURIComponent(text)}&char=${encodeURIComponent(char)}&mode=${encodeURIComponent(mode)}`,
      {
        headers: {
          Authorization: `ApiKey ${apiKey}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Failed to change text to speech.';
    throw new Error(msg);
  }
}
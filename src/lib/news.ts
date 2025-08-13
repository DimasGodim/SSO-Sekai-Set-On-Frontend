import { AxiosError } from "axios";
import apiClient from './api-client';
import { NewsItem } from './types';

// Fungsi list news
export async function ListNews(apiKey: string): Promise<NewsItem[]> {
  try {
    const res = await apiClient.get(
      `/news/list`,
      {
        headers: {
          Authorization: `ApiKey ${apiKey}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Failed to fetch news list.';
    throw new Error(msg);
  }
}

// Fungsi filter news
export async function FilterNews(apiKey: string, title: string): Promise<NewsItem[]> {
  try {
    const res = await apiClient.get(
      `/news/filter?title=${encodeURIComponent(title)}`,
      {
        headers: {
          Authorization: `ApiKey ${apiKey}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ detail?: string }>;
    const msg = error.response?.data?.detail ?? 'Failed to filter news.';
    throw new Error(msg);
  }
}

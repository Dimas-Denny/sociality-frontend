export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Generic wrapper used by every Sociality API response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination meta returned by every list endpoint
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PageParams {
  page: number;
  limit: number;
}

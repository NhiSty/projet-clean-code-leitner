import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export class HttpError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new HttpError(
      "An error occurred while fetching the data.",
      res.status
    );
  }
  return res.json();
}

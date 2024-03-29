import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export class HttpError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface ValidationError {
  field: string;
  message: string;
  rule: string;
}
export class UnprocessableContentError extends HttpError {
  public constructor(public readonly errors: ValidationError[]) {
    super("Unprocessable content", 422);
  }
}

export class ConflictError extends HttpError {
  public constructor(message: string) {
    super(message, 409);
  }
}

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options
  });
  if (!res.ok) {
    if (res.status === 422) { 
      throw new UnprocessableContentError(await res.json().then((e) => e.errors));
    }

    if (res.status === 409) {
      throw new ConflictError(await res.json().then((e) => e.message));
    }

    throw new HttpError(
      "An error occurred while fetching the data.",
      res.status
    );
  }
  return res.json();
}

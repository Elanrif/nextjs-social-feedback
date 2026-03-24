"use client";

import { AuthPayload } from "@/lib/auth/models/auth.model";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const SESSION_QUERY_KEY = ["session"];

const fetcher = async (): Promise<Result<AuthPayload, CrudApiError>> => {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      error: { error: "Unauthorized", status: 401, message: "Not authenticated" },
    };
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "Failed to fetch session" }));
    throw {
      error: errorData.error ?? "Error",
      status: errorData.status ?? res.status,
      message: errorData.message ?? "Failed to fetch session",
    } as CrudApiError;
  }

  const session: Result<AuthPayload, CrudApiError> = await res.json();

  if (!session.ok || !session.data?.user?.id) {
    return {
      ok: false,
      error: { error: "Unauthorized", status: 401, message: "You must be logged in" },
    };
  }

  return session;
};

export const useSession = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Result<AuthPayload, CrudApiError>>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetcher,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    session: data,
    isLoading,
    error,
    // Refetch latest session data from server
    refresh: () =>
      queryClient.invalidateQueries({
        queryKey: SESSION_QUERY_KEY,
      }),
    // Clear session cache (e.g. after sign-out) without refetching
    invalidate: () => queryClient.setQueryData(SESSION_QUERY_KEY, undefined),
  };
};

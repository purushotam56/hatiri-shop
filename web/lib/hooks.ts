import { useCallback, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

// Hook for GET requests
export const useApiGet = <T = any>(endpoint: string, options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await apiGet(endpoint);
      setState({ data, loading: false, error: null });
      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, loading: false, error: err });
      options?.onError?.(err);
      throw err;
    }
  }, [endpoint, options]);

  return { ...state, fetch };
};

// Hook for POST requests
export const useApiPost = <T = any>(endpoint?: string, options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const post = useCallback(
    async (body?: any, customEndpoint?: string) => {
      const url = customEndpoint || endpoint;
      if (!url) throw new Error("Endpoint is required");

      setState({ data: null, loading: true, error: null });
      try {
        const data = await apiPost(url, body);
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [endpoint, options]
  );

  return { ...state, post };
};

// Hook for PUT requests
export const useApiPut = <T = any>(endpoint?: string, options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const put = useCallback(
    async (body?: any, customEndpoint?: string) => {
      const url = customEndpoint || endpoint;
      if (!url) throw new Error("Endpoint is required");

      setState({ data: null, loading: true, error: null });
      try {
        const data = await apiPut(url, body);
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [endpoint, options]
  );

  return { ...state, put };
};

// Hook for DELETE requests
export const useApiDelete = <T = any>(endpoint?: string, options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const remove = useCallback(
    async (customEndpoint?: string) => {
      const url = customEndpoint || endpoint;
      if (!url) throw new Error("Endpoint is required");

      setState({ data: null, loading: true, error: null });
      try {
        const data = await apiDelete(url);
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [endpoint, options]
  );

  return { ...state, remove };
};

// Hook for PATCH requests
export const useApiPatch = <T = any>(endpoint?: string, options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const patch = useCallback(
    async (body?: any, customEndpoint?: string) => {
      const url = customEndpoint || endpoint;
      if (!url) throw new Error("Endpoint is required");

      setState({ data: null, loading: true, error: null });
      try {
        const data = await apiPatch(url, body);
        setState({ data, loading: false, error: null });
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, loading: false, error: err });
        options?.onError?.(err);
        throw err;
      }
    },
    [endpoint, options]
  );

  return { ...state, patch };
};

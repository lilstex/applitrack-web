import useSWR from "swr";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";

// Fetcher function for SWR
const fetcher = (url: string) => apiClient.get(url).then((res) => res.data);

export function useAuth() {
  const token = Cookies.get("token");

  const { data, error, mutate, isLoading } = useSWR(
    token ? "/profile" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return {
    user: data,
    isLoading,
    isError: error,
    mutateUser: mutate,
    logout,
    isLoggedIn: !!data && !error,
  };
}

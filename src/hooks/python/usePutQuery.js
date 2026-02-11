import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestPython } from "../../services/api"; // kerakli path bo'yicha moslashtir

const usePutQuery = ({
  hideSuccessToast = false,
  hideErrorToast = false,
  listKeyId = null,
  apiClient = requestPython, // ✅ Accept apiClient as parameter
}) => {
  // PUT so'rovni yuboruvchi funksiya
  const putRequest = (url, attributes, config = {}) =>
    apiClient.put(url, attributes, {
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
      ...config,
    });
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ url, attributes, config = {} }) =>
      putRequest(url, attributes, config),
    onSuccess: (data) => {
      if (!hideSuccessToast) {
        toast.success(data?.data?.message || "SUCCESS");
      }

      if (listKeyId) {
        queryClient.invalidateQueries({ queryKey: [listKeyId] });
      }
    },
    onError: (data) => {
      if (!hideErrorToast) {
        toast.error(data?.response?.data?.message || "ERROR");
      }
    },
  });

  return {
    mutate,
    isLoading: isPending,
    isError,
    error,
  };
};

export default usePutQuery;

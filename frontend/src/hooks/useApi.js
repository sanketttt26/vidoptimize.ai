import { useState, useCallback } from "react";
import api from "../utils/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api[method](url, data);
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "An error occurred";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getTitleSuggestions = async (videoUrl, currentTitle) => {
    const res = await api.post("/ai/title", { videoUrl, currentTitle });
    return { titles: res.data.titles, ytTitle: res.data.ytTitle };
  };

  const getAllSuggestions = async (videoUrl, currentTitle, ytTitle) => {
    const res = await api.post("/optimizations/suggest", {
      videoUrl,
      currentTitle: currentTitle || ytTitle,
      type: "all",
    });
    return res.data.suggestions;
  };

  return { loading, error, request, getTitleSuggestions, getAllSuggestions };
};

export default useApi;

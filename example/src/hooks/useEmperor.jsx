import http from "../http";
import { useState } from "react";

const useEmperor = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEmperors = async () => {
    setLoading(true);
    try {
      const res = await http.get("/emperors");
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getEmperorById = async (id) => {
    setLoading(true);
    try {
      const res = await http.get(`/emperors/${id}`);
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getEmperors, getEmperorById };
};

export default useEmperor;

import useSWR, { mutate } from "swr";

import http from "../http";

const useEmperor = () => {
  const getEmperors = () => {
    const { data, error } = useSWR("/emperors", http.get);
    return { emperor: data || [], loading: !error && !data, error };
  };

  const getEmperorById = (id) => {
    const { data, error } = useSWR(`/emperors/${id}`, http.get);
    return { emperor: data || [], loading: !error && !data, error };
  };

  const addEmperor = async (emperor) => {
    const { data: newEmperor } = await http.post("/emperors", emperor);
    mutate("/emperors");
    return newEmperor;
  };

  return { getEmperors, getEmperorById, addEmperor };
};

export default useEmperor;

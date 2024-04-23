import axios from "axios";
import config from "../../../../config.js";
import useSWR from "swr";

const instance = axios.create({
  baseURL: config.api,
});

const fetcher = (url) => instance.get(url).then((res) => res.data);

export const useProject = () => {
  const GetItems = () => {
    const path = config.itemsPath;
    const { data, error } = useSWR(path, fetcher);

    return { items: data || [], loading: !error && !data };
  };

  return {
    GetItems,
  };
};

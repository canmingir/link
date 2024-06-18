import axios from "axios";
import config from "../config/config";
import useSWR from "swr";

const { api, itemsPath } = config.get();

const instance = axios.create({
  baseURL: api,
});

const fetcher = (url) => instance.get(url).then((res) => res.data);

export const useProject = () => {
  const GetItems = () => {
    const path = itemsPath;
    const { data, error } = useSWR(path, fetcher);

    return { items: data || [], loading: !error && !data };
  };

  return {
    GetItems,
  };
};

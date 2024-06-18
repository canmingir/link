import axios from "axios";
import config from "../../../../config";
import templateConfig from "../../../../config.template";
import useSWR from "swr";

const instance = axios.create({
  baseURL: config.api,
});

const fetcher = (url) => instance.get(url).then((res) => res.data);

export const useProject = () => {
  const GetItems = () => {
    const path = templateConfig.itemsPath;
    const { data, error } = useSWR(path, fetcher);
    console.log("data", data);
    return { items: data || [], loading: !error && !data };
  };

  return {
    GetItems,
  };
};

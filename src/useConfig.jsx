import {
  LoadConfig,
  LoadMenuConfig,
  LoadRoutes,
} from "../configLoader/configLoader";
import { useEffect, useState } from "react";

function useConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await LoadConfig();
      setConfig(configData);
    };

    fetchConfig();
  }, []);

  return config;
}

function useMenuConfig() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await LoadMenuConfig();
      setConfig(configData);
    };

    fetchConfig();
  }, []);

  return config;
}

function useRoutes() {
  const [routes, setRoutes] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await LoadRoutes();
      setRoutes(configData);
    };

    fetchConfig();
  }, []);

  return routes;
}
export { useConfig, useMenuConfig, useRoutes };

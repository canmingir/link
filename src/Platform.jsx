import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "./context/ConfigContext";
import ContextProvider from "./ContextProvider/ContextProvider";
import Loading from "./Loading/Loading";
import RouteManager from "./RouteManager/RouteManager";
import { ToastContainer } from "react-toastify";
import globalConfig from "./config";
import React, { useEffect } from "react";
import { initialState, reducer } from "./context/reducer";

const Platform = ({ config }) => {
  useEffect(() => {
    globalConfig(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <ConfigProvider value={config}>
        <ContextProvider reducer={reducer} state={initialState}>
          <ToastContainer />
          <Loading />
          <RouteManager routes={config.routes} />
        </ContextProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default Platform;

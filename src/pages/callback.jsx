import oauth from "../http/oauth";
import { storage } from "@nucleoidjs/webstorage";
import { useContext } from "../ContextProvider/ContextProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Callback() {
  const [, dispatch] = useContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    oauth
      .post("/oauth", { code })
      .then(({ data }) => {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        storage.set("accessToken", accessToken);
        storage.set("refreshToken", refreshToken);
        dispatch({ type: "LOGIN" });
        navigate("/");
      })
      .catch((error) => {
        console.debug(error);
      });
  }, [dispatch, location.search, navigate]);

  return "loading";
}

export default Callback;

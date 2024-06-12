import config from "../config/config";
import jwtDecode from "jwt-decode";
import { storage } from "@nucleoidjs/webstorage";

const { name } = config.get();

let login = true;
const itemId = storage.get("itemId");
try {
  const token = storage.get(name, "accessToken");
  const decodedToken = jwtDecode(token);

  if (decodedToken.exp * 1000 < Date.now()) {
    login = false;
  }
} catch (err) {
  login = false;
}

export const initialState = {
  login,
  itemId,
};

export const reducer = (state, action) => {
  state = { ...state };

  switch (action.type) {
    case "LOGIN": {
      state.login = true;
      break;
    }
    case "LOGOUT": {
      storage.clear();
      state.login = false;
      break;
    }

    case "ITEM_SELECT": {
      state.itemId = action.payload;
      storage.set("itemId", state.itemId);
      break;
    }

    case "ITEM_DELETE": {
      storage.remove("itemId");
      state.itemId = null;
      break;
    }

    default:
  }

  return state;
};

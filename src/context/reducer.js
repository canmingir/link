import jwtDecode from "jwt-decode";
import { storage } from "@nucleoidjs/webstorage";

let login = true;
const itemId = storage.get("dashboard", "itemId");
try {
  const token = storage.get("dashboard", "accessToken");
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
      storage.set("dashboard", "itemId", state.itemId);
      break;
    }

    case "ITEM_DELETE": {
      storage.remove("dashboard", "itemId");
      state.itemId = null;
      break;
    }

    default:
  }

  return state;
};

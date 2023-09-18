import http from "../http";

import {
  actionTypes as chatActionTypes,
  initialState as chatInitialState,
  chatReducer,
} from "../context/chatReducer";
import { useCallback, useReducer } from "react";

export default function useChatState() {
  const [chatState, chatDispatch] = useReducer(chatReducer, chatInitialState);

  const fetchChatUser = useCallback(async (teamId) => {
    await http.get(`api/teams/${teamId}/colleagues`).then((chatUserResponse) =>
      chatDispatch({
        type: chatActionTypes.SET_USERS,
        payload: chatUserResponse?.data,
      })
    );
  }, []);

  const chatLoading = () => {
    chatDispatch({
      type: chatActionTypes.START_LOADING,
    });
  };
  const chatError = () => {
    chatDispatch({
      type: chatActionTypes.SET_ERROR,
    });
  };

  return {
    chatState,
    fetchChatUser,
    chatLoading,
    chatError,
  };
}

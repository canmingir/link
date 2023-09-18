import http from "../http";

import {
  actionTypes as colleagueActionTypes,
  initialState as colleagueInitialState,
  colleagueReducer,
} from "../context/colleagueReducer";
import { useCallback, useReducer } from "react";

export default function useColleagueState(teamId) {
  const [colleagueState, colleagueDispatch] = useReducer(
    colleagueReducer,
    colleagueInitialState
  );
  const fetchColleagues = useCallback(async () => {
    const colleaguesResponse = await http.get(
      `/api/teams/${teamId}/colleagues`
    );
    colleagueDispatch({
      type: colleagueActionTypes.FETCH_COLLEAGUES_DATA,
      payload: colleaguesResponse.data,
    });
  }, [teamId]);

  const getColleagueById = async (id) => {
    const response = await http.get(`/api/colleagues/${id}`);
    colleagueDispatch({
      type: colleagueActionTypes.SET_COLLEAGUE_TO_EDIT,
      payload: response.data,
    });
    return response.data;
  };

  const setColleagueForEditing = (colleague) => {
    colleagueDispatch({
      type: colleagueActionTypes.SET_COLLEAGUE_TO_EDIT,
      payload: colleague,
    });
  };

  const editColleague = async (id, updatedColleague) => {
    await http.put(`/api/colleagues/${id}`, updatedColleague);
    await fetchColleagues();
  };

  const addColleague = async (newColleague) => {
    newColleague.teamId = parseInt(teamId);
    await http.post(`/api/colleagues`, newColleague);
    await fetchColleagues();
  };

  const deleteColleague = async (id) => {
    await http.delete(`/api/colleagues/${id}`);
    await fetchColleagues();
  };

  return {
    colleagueState,
    editColleague,
    addColleague,
    deleteColleague,
    setColleagueForEditing,
    fetchColleagues,
    getColleagueById,
  };
}

import http from "../http";

import {
  actionTypes as teamActionTypes,
  initialState as teamInitialState,
  teamReducer,
} from "../context/teamReducer";
import { useCallback, useReducer } from "react";

const useTeamsState = () => {
  const [teamState, dispatch] = useReducer(teamReducer, teamInitialState);
  const fetchTeamsData = useCallback(async () => {
    const response = await http.get(`/api/teams`);
    const teams = response.data;
    dispatch({
      type: teamActionTypes.FETCH_TEAMS_DATA,
      payload: teams,
    });
  }, []);

  const getTeamDataById = useCallback(async (id) => {
    const response = await http.get(`/api/teams/${id}`);
    dispatch({
      type: teamActionTypes.SET_TEAM_TO_EDIT,
      payload: response.data,
    });
  }, []);
  const setTeamForEditing = useCallback((team) => {
    dispatch({
      type: teamActionTypes.SET_TEAM_TO_EDIT,
      payload: team,
    });
  }, []);

  const fetchTeams = useCallback(async () => {
    const response = await http.get(`/api/teams`);
    const teams = response.data;
    dispatch({
      type: teamActionTypes.FETCH_TEAMS_DATA,
      payload: teams,
    });

    const responses = await Promise.all(
      teams.map((team) => http.get(`/api/teams/${team.id}/colleagues`))
    );

    const membersData = responses.map((response) => response.data);
    dispatch({
      type: teamActionTypes.FETCH_TEAMS_MEMBERS,
      payload: membersData,
    });
  }, []);

  const getTeamById = useCallback(
    async (id) => {
      const response = await http.get(`/api/teams/${id}`);
      dispatch({
        type: teamActionTypes.SET_TEAM_TO_EDIT,
        payload: response.data,
      });
      await fetchTeams();
    },
    [fetchTeams]
  );

  const editTeam = useCallback(
    async (id, updatedTeam) => {
      await http.put(`/api/teams/${id}`, updatedTeam);
      await fetchTeams();
    },
    [fetchTeams]
  );

  const addTeamAndColleague = useCallback(
    async (items) => {
      const [team, colleague] = items;
      const response = await http.post(`/api/teams`, team);
      colleague.teamId = response.data.id;
      await http.post(`/api/colleagues`, colleague);
      await fetchTeams();
    },
    [fetchTeams]
  );

  const deleteTeam = useCallback(
    async (id) => {
      await http.delete(`/api/teams/${id}`);
      await fetchTeams();
    },
    [fetchTeams]
  );

  return {
    teamState,
    dispatch,
    fetchTeams,
    getTeamById,
    fetchTeamsData,
    getTeamDataById,
    editTeam,
    addTeamAndColleague,
    deleteTeam,
    setTeamForEditing,
  };
};

export default useTeamsState;

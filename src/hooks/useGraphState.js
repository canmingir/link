import http from "../http";

import {
  actionTypes as graphActionTypes,
  initialState as graphInitialState,
  graphReducer,
} from "../context/graphReducer";
import { useCallback, useReducer } from "react";

export default function useGraphState() {
  const [graphState, graphDispatch] = useReducer(
    graphReducer,
    graphInitialState
  );
  const fetchPieGraph = useCallback(async (id) => {
    const pieGraphResponse = await http.get(`/api/serviceUsages/${id}`);
    graphDispatch({
      type: graphActionTypes.SET_PIE_GRAPH,
      payload: pieGraphResponse.data,
    });
  }, []);

  const fetchLineGraph = useCallback(async (id) => {
    const lineGraphResponse = await http.get(`/api/correctAnswers/${id}`);
    graphDispatch({
      type: graphActionTypes.SET_LINE_GRAPH,
      payload: lineGraphResponse.data,
    });
  }, []);

  return {
    graphState,
    fetchPieGraph,
    fetchLineGraph,
  };
}

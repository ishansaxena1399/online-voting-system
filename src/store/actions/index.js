import { LOGIN, LOGOUT, SET_CANDIDATES_DATA, SET_PARTIES_DATA, SET_POSITIONS_DATA, SET_VOTERS_DATA, UPDATE_ALREADY_VOTED, UPDATE_TIME_STATE } from "../actionTypes";

export const setUserLoginDetails = (payload) => {
  return {
    type: LOGIN,
    payload
  };
};

export const logoutUser = (payload) => {
  return {
    type: LOGOUT,
    payload
  };
};

export const setPartiesData = (payload) => {
  return {
    type: SET_PARTIES_DATA,
    payload
  };
};

export const setCandidatesData = (payload) => {
  return {
    type: SET_CANDIDATES_DATA,
    payload
  };
};

export const setVotersData = (payload) => {
  return {
    type: SET_VOTERS_DATA,
    payload
  };
};

export const setPositionsData = (payload) => {
  return {
    type: SET_POSITIONS_DATA,
    payload
  };
};

export const updateTimeState = (payload) => {
  return {
    type: UPDATE_TIME_STATE,
    payload
  };
};

export const updateVotedState = (payload) => {
  return {
    type: UPDATE_ALREADY_VOTED,
    payload
  };
};
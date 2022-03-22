import { deleteToken, deleteUserCookie, setUserCookie } from "../../helpers/common.helpers";
import { LOGOUT, LOGIN, SET_PARTIES_DATA, SET_VOTERS_DATA, SET_CANDIDATES_DATA, SET_POSITIONS_DATA, UPDATE_TIME_STATE, UPDATE_ALREADY_VOTED } from "../actionTypes";

export default (state, action) => {
  console.log(action);
  switch(action.type) {
    case LOGOUT:
      deleteToken();
      deleteUserCookie();
      return {
        ...state,
        user: { isLoggedIn: false, details: false }
      };
    case LOGIN:
      setUserCookie(action.payload.user.details);
      return { ...state, ...action.payload };
    case SET_PARTIES_DATA:
    case SET_VOTERS_DATA:
    case SET_CANDIDATES_DATA:
    case SET_POSITIONS_DATA:
    case UPDATE_TIME_STATE:
    case UPDATE_ALREADY_VOTED:
      return { ...state, ...action.payload, "timeCount": action.payload.timeCount };
    default:
      console.log(`Action type ${action.type} does not exist`);
  };
};
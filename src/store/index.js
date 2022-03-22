import React, { useContext, useReducer, createContext } from "react";
import { cloneDeep } from "lodash";
import reducer from "./reducers";
import initialState from "./states";

const StateContext = createContext();

export const StateProvider = ({ children, store }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  store.dispatch = dispatch;
  store.getState = () => cloneDeep(state);

  return(
    <StateContext.Provider value={{ state, dispatch }} >
      { children }
    </StateContext.Provider>
  );
}

const useGlobalState = () => useContext(StateContext);
export const store = { dispatch: null, getState: null };

export default useGlobalState;
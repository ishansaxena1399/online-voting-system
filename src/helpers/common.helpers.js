import Cookie from "js-cookie";

export const getToken = () => {
  if(window.localStorage) {
    return window.localStorage.getItem("token");
  }
};

export const setToken = async(token) => {
  if(window.localStorage) {
    window.localStorage.setItem("token", token);
  }
};

export const deleteToken = () => {
  if(window.localStorage) {
    window.localStorage.removeItem("token");
  }
};

export const setUserCookie = (user) => {
  user = JSON.stringify(user);
  Cookie.set("user", user, { expires: 30 });
};

export const getUserCookie = () => {
  const user = Cookie.get("user");
  if(user) return JSON.parse(user);
  else return null;
};

export const deleteUserCookie = () => Cookie.remove("user");
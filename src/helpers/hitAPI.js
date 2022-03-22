import axios from "axios";

export const hitAPI = async (httpMethod, payload, endpoint) => {
  const apiUrl = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_LOCAL_URL : process.env.REACT_APP_API_PROD_URL) + endpoint;

  let response = null;

  switch (httpMethod) {
    case "POST":
      response = await axios.post(
        apiUrl,
        payload || {}
      );
      break;
    case "POSTEDIT":
      response = await axios.post(apiUrl, payload || {});
      break;
    case "GET":
      response = await axios.get(
        apiUrl + `?page=${payload.page}&limit=${payload.limit}`,
      )
      break;
    case "GETSINGLE":
      response = await axios.get(apiUrl);
      break;
    case "DELETE":
        response = await axios.delete(apiUrl + `?dataId=${payload.id}`);
        break;
  }

  return response.data;
}
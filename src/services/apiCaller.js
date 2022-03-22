import axios from "axios";

export const callAPI = async(configObj) => {

  axios.interceptors.response.use(
    function(response) {
      return Promise.resolve(response);
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  const response = await axios({
    ...configObj,
  })
  .then(function(result) {
    return result;
  })
  .catch(error => {
    return error.response;
  });

  return response.data;
}
import { callAPI } from "./apiCaller";
import { baseUrl } from "../constants/common.constants";
import { getToken } from "../helpers/common.helpers"; 

let data = null;

export const ADMIN_SERVICE = {
  "addCandidate": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/candidate`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "editCandidate": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/editCandidate`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "deleteCandidate": async(params) => {
    const configObj = {
      "method": "DELETE",
      "url":  `${baseUrl}admin/deleteCandidate`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "addParty": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/party`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "editParty": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/editParty`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "deleteParty": async(params) => {
    const configObj = {
      "method": "DELETE",
      "url":  `${baseUrl}admin/deleteParty`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "startTimer": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/updateVotingStatus`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "finishTimer": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/updateVotingStatus`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data; 
  },
  "addPosition": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/position`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "editPosition": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/editPosition`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "deletePosition": async(params) => {
    const configObj = {
      "method": "DELETE",
      "url":  `${baseUrl}admin/deletePosition`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "deleteVoter": async(params) => {
    const configObj = {
      "method": "DELETE",
      "url":  `${baseUrl}admin/deleteVoter`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
  "resetVotes": async(params) => {
    const configObj = {
      "method": "POST",
      "url":  `${baseUrl}admin/resetVotes`,
      "data": params,
      "headers": {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${getToken()}`
      }
    };

    data = await callAPI(configObj);
    return data;
  },
};
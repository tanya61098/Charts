import axios from "axios";
import { endpoint } from "./endpoint";
import { setAccessToken, resetData } from "features/login/LoginSlice";

async function createRequest({ reqHeaders, params, authToken }) {
  if (authToken) {
    return axios.create({
      baseURL: endpoint.API_BASE_URL,
      responseType: "json",
      crossdomain: true,
      headers: {
        "Content-Type": reqHeaders?.["Content-Type"] || "application/json",
        Authorization: "Bearer " + authToken,
        Accept: "application/json",
        ...reqHeaders,
      },
      params,
    });
  } else {
    return axios.create({
      baseURL: endpoint.API_BASE_URL,
      responseType: "json",
      crossdomain: true,
      headers: {
        "Content-Type": reqHeaders?.["Content-Type"] || "application/json",
        Accept: "application/json",
        ...reqHeaders,
      },
      params,
    });
  }
}

export const handleCatchBlock = (error) => {
  console.log("Something went wrong fetching apis - ", error);
};

export async function apiHandler({
  url,
  method,
  headers: reqHeaders,
  data: jsonData,
  params,
  authToken,
  navigate,
  refreshToken,
  dispatch,
}) {
  try {
    const request = await createRequest({ reqHeaders, params, authToken });
    let result = [];
    switch (method) {
      case "POST":
        result = await request.post(url, jsonData);
        break;

      case "PUT":
        result = await request.put(url, jsonData);
        break;

      case "DELETE":
        result = await request.delete(url);
        break;

      default:
        result = await request.get(url);
    }
    const { data, headers, status } = result;
    return { data, headers, status };
  } catch (error) {
    handleCatchBlock(error);
    if (error.response) {
      const { data, headers, status } = error.response;
      if (status == 401) {
        // let refresh_status = 200;
        // const result_refresh = await fetch(
        //   "https://example.com/api/auth/refreshToken",
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",

        //       Authorization: "Bearer " + refreshToken,
        //     },
        //     body: JSON.stringify({}),
        //   }
        // ).then((data) => {
        //   refresh_status = data.status;
        //   return data.json();
        // });
        // if (refresh_status === 401) {
          dispatch(resetData());
          navigate("/", { replace: true });
        // } else {
        //   dispatch(setAccessToken(result_refresh.data));
        // }
      }
      return { data, headers, status };
    } else {
      return {
        data: { error_code: 500, error_message: "Error in getting data" },
      };
    }
  }
}

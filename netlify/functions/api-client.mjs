import apiClientConstants from "./api-client-constants.mjs";
const axios = require("axios");
require("dotenv").config();

const { REVOLUT_SK_SANDBOX } = process.env;

export const handler = async (event) => {
  const {
    CREATE_ORDER,
    RETRIEVE_ORDER,
    RETRIEVE_ORDER_LIST,
    CREATE_CUSTOMER,
    RETRIEVE_CUSTOMER_PAYMENT_METHODS,
  } = apiClientConstants;
  console.log("revolut endpoint hit with", JSON.parse(event.body));
  console.log("actionConstants", apiClientConstants);

  let { body, method, apiAction } = JSON.parse(event.body);
  let config = {
    method,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${REVOLUT_SK_SANDBOX}`,
      "Revolut-Api-Version": "2023-09-01",
    },
  };
  const objectToQueryString = (obj) => {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    });
    return keyValuePairs.join("&");
  };

  switch (apiAction) {
    case CREATE_ORDER:
      config = {
        ...config,
        url: "https://sandbox-merchant.revolut.com/api/orders",
        data: body,
      };
      break;
    case RETRIEVE_ORDER:
      config = {
        ...config,
        url: "https://sandbox-merchant.revolut.com/api/orders/" + body,
      };
      break;
    case RETRIEVE_ORDER_LIST:
      let url = "https://sandbox-merchant.revolut.com/api/1.0/orders";
      if (Object.keys(body).length) {
        let queryParams = "?" + objectToQueryString(body);
        url += queryParams;
      }
      config = {
        ...config,
        url,
      };
      break;
    case CREATE_CUSTOMER:
      config = {
        ...config,
        url: "https://sandbox-merchant.revolut.com/api/1.0/customers",
        data: body,
      };
      break;
    case RETRIEVE_CUSTOMER_PAYMENT_METHODS:
      config = {
        ...config,
        url: `https://sandbox-merchant.revolut.com/api/1.0/customers/${body.revolutCustomerId}/payment-methods`,
      };
      break;
    default:
      console.log("API action scenario not available");
  }

  try {
    let revolutApiRequest = await axios.request(config).then((response) => {
      console.log("revolut api response: ", response.data);
      return response.data;
    });
    return {
      statusCode: 200,
      body: JSON.stringify(revolutApiRequest),
    };
  } catch (error) {
    console.error({ error });
    return {
      status: 400,
      body: JSON.stringify({ error }),
    };
  }
};

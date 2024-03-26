const axios = require("axios");
require("dotenv").config();

const { REVOLUT_SK_SANDBOX } = process.env;

export const handler = async (event) => {
  console.log("create order endpoint hit with", JSON.parse(event.body));

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
  switch (apiAction) {
    case "create":
      config = {
        ...config,
        url: "https://sandbox-merchant.revolut.com/api/orders",
        data: body,
      };
      break;
    case "retrieve":
      config = {
        ...config,
        url: "https://sandbox-merchant.revolut.com/api/orders/" + body,
      };
      break;
    default:
      console.log("API action scenario not available");
  }

  try {
    let revolutOrder = await axios.request(config).then((response) => {
      console.log("revolut api response: ", response.data);
      return response.data;
    });
    return {
      statusCode: 200,
      body: JSON.stringify(revolutOrder),
    };
  } catch (error) {
    console.error({ error });
    return {
      status: 400,
      body: JSON.stringify({ error }),
    };
  }
};

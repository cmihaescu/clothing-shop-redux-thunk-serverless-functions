import { getUserFromFirebase } from "../../src/utils/firebase.utils";
const axios = require("axios");
require("dotenv").config();

const { REVOLUT_SK_SANDBOX } = process.env;

export const handler = async (e) => {
  console.log("webhook endpoint hit with: ", JSON.parse(e.body));
  let webhook_notification = JSON.parse(e.body);
  const { order_id, event, merchant_order_ext_ref } = webhook_notification;
  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${REVOLUT_SK_SANDBOX}`,
      "Revolut-Api-Version": "2023-09-01",
    },
    url: "https://sandbox-merchant.revolut.com/api/orders/" + order_id,
  };
  try {
    let revolutOrder = await axios.request(config).then((response) => {
      console.log("revolut api response: ", response.data);
      return response.data;
    });
    const user = await getUserFromFirebase("sHVO3LUXxKYAarVAdqpNj4gNN1h2");
    console.log("USER: ", user);
    /// I need to add firebase uid to customer object -> need to add uid on order creation or customer creation
    return {
      statusCode: 200,
      body: JSON.stringify(revolutOrder),
    };
  } catch (error) {
    console.error({ error });
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }
};

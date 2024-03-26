import axios from "axios";

export const apiClientRevolutOrders = async (method, body, apiAction) => {
  let order = await axios("/.netlify/functions/api-client", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: { body, method, apiAction },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(
        `An error occured while trying to ${apiAction} the order: `,
        err
      );
    });

  return order;
};

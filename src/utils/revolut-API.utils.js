import axios from "axios";

export const apiClientRevolut = async (method, body, apiAction) => {
  let revolutApiRequest = await axios("/.netlify/functions/api-client", {
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
        `An error occured while trying to ${apiAction} the revolutApiRequest: `,
        err
      );
    });

  return revolutApiRequest;
};

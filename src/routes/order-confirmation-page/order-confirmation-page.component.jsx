import { useEffect, useState } from "react";
import { apiClientRevolut } from "../../utils/revolut-API.utils";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cart/cart-actions";
import { Link, useLocation } from "react-router-dom";
import { RETRIEVE_ORDER } from "../../utils/revolut-API-constants.utils";
import "./order-confirmation-page.styles.scss";

export const OrderConfirmationPage = ({ orderId }) => {
  const [orderSuccess, setOrderSuccess] = useState("initial");
  const dispatch = useDispatch();
  const location = useLocation();
  let queryParams = new URLSearchParams(location.search);
  let queryFailureMessage = queryParams.get("_rp_fr");
  queryFailureMessage
    ? (queryFailureMessage += ". ")
    : (queryFailureMessage = "Unfortunately, your payment failed. ");
  const successfulParagraph = `Thank you for your order. The payment was successful. Order ID is ${orderId}`;
  const failureParagraph = `${queryFailureMessage}Order ID is ${orderId}. Your cart has not been cleared in case you wish to try with another card`;

  const fetchOrder = async () => {
    let order = await apiClientRevolut("get", orderId, RETRIEVE_ORDER);
    return order;
  };
  useEffect(() => {
    fetchOrder()
      .then((order) => {
        if (
          order.state.toLowerCase() === "completed" ||
          order.state === "authorised"
        ) {
          setOrderSuccess(true);
          dispatch(clearCart());
        } else {
          setOrderSuccess(false);
        }
      })
      .catch((error) => console.error(error));
  });

  return (
    <div className="confirmation-page-content">
      {orderSuccess !== "initial" ? (
        orderSuccess === true ? (
          <>
            <p>{successfulParagraph}</p>
            <Link className="shop-some-more-btn" to="/shop">
              Shop some more!
            </Link>
          </>
        ) : (
          <p>{failureParagraph}</p>
        )
      ) : (
        <p>Please wait...</p>
      )}
    </div>
  );
};

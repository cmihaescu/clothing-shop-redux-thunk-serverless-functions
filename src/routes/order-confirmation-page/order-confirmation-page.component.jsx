import { useEffect, useState } from "react";
import { apiClientRevolutOrders } from "../../utils/revolutAPI.utils";
import { useDispatch } from "react-redux";
import { clearCart } from "../../store/cart/cart-actions";
import { Link, useLocation } from "react-router-dom";
import "./order-confirmation-page.styles.scss";

export const OrderConfirmationPage = ({ orderId }) => {
  const [orderSuccess, setOrderSuccess] = useState("initial");
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryFailureMessage = queryParams.get("_rp_fr");
  const successfulParagraph = `Thank you for your order. The payment was successful. Order ID is ${orderId}`;
  const failureParagraph = `${queryFailureMessage}. Order ID is ${orderId}. Your cart has not been cleared in case you wish to try with another card`;

  useEffect(() => {
    const fetchOrder = async () => {
      let order = await apiClientRevolutOrders("get", orderId, "retrieve");
      return order;
    };
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
      .catch((error) => console.log(error));
  }, []);

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

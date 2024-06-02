import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { apiClientRevolut } from "../../utils/revolutAPI.utils";
import { useState } from "react";
import Button from "../button/button.component";
import "./signed-in-page.styles.scss";
import { Link } from "react-router-dom";

const SignedInPage = () => {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showSavedCards, setSavedCards] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  let { email, displayName, uid } = currentUser;
  console.log("redux currentUser", currentUser);
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  let firstName = displayName.split(" ")[0];

  const handleRetrieveOrders = async () => {
    try {
      const ordersList = await apiClientRevolut(
        "GET",
        { email, state: "COMPLETED" },
        "retrieve_order_list"
      );
      setOrders(ordersList);
      setShowOrders(!showOrders);
    } catch (error) {
      console.error("There was a problem retrieving the orders list: ", error);
    }
  };

  const handleRetrieveSavedCards = () => {};

  return (
    <div className="signed-in-page">
      <h1>Welcome {firstName.length ? firstName : " to your account page"}!</h1>
      <div className="account-container">
        <div className="account-details">
          <p>Email: {email}</p>
          <p>Name: {displayName}</p>
        </div>
        <div className="account-orders">
          <Button buttonType="inverted" onClick={handleRetrieveOrders}>
            {showOrders ? "hide" : "show"} my completed orders
          </Button>
          {showOrders && (
            <ol>
              {orders.length < 1 ? (
                <>
                  <p>You have no completed orders yet. </p>
                  <Link className="go-to-shop-link" to="/shop">
                    Go to shop?
                  </Link>
                </>
              ) : (
                orders.map((order, i) => {
                  let { value, currency } = order.order_amount;
                  value = value.toString();
                  value =
                    value.slice(0, value.length - 2) +
                    "," +
                    value.slice(value.length - 2);
                  return (
                    <li key={i}>
                      <p>{order.id}</p>
                      <p>
                        {value} {" " + currency}
                      </p>
                    </li>
                  );
                })
              )}
            </ol>
          )}

          <Button buttonType="inverted" onClick={handleRetrieveSavedCards}>
            {showSavedCards ? "hide" : "show"} my saved cards
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignedInPage;

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { apiClientRevolut } from "../../utils/revolut-API.utils";
import { useState } from "react";
import Button from "../button/button.component";
import { Link } from "react-router-dom";
import { RETRIEVE_ORDER_LIST } from "../../utils/revolut-API-constants.utils";
import { RETRIEVE_CUSTOMER_PAYMENT_METHODS } from "../../utils/revolut-API-constants.utils";
import "./signed-in-page.styles.scss";

const SignedInPage = () => {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [savedCards, setSavedCards] = useState(false);
  const [showSavedCards, setshowSavedCards] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  let { email, displayName, revolutCustomerId } = currentUser;
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  let firstName = displayName.split(" ")[0];

  const handleRetrieveOrders = async () => {
    try {
      const ordersList = await apiClientRevolut(
        "GET",
        { email, state: "COMPLETED" },
        RETRIEVE_ORDER_LIST
      );
      setOrders(ordersList);
      setShowOrders(!showOrders);
    } catch (error) {
      console.error("There was a problem retrieving the orders list: ", error);
    }
  };

  const handleRetrieveSavedCards = async () => {
    try {
      const savedCards = await apiClientRevolut(
        "GET",
        { revolutCustomerId },
        RETRIEVE_CUSTOMER_PAYMENT_METHODS
      );
      console.log("savedCards", savedCards);
      setSavedCards(savedCards);
      setshowSavedCards(!showSavedCards);
    } catch (err) {
      console.error(
        "There was a problem retrieving the payment methods list: ",
        err
      );
    }
  };

  return (
    <div className="signed-in-page">
      <h1>Welcome {firstName.length ? firstName : " to your account page"}!</h1>
      <div className="account-container">
        <div className="account-details">
          <p>Email: {email}</p>
          <p>Name: {displayName}</p>
        </div>
        <div className="account-features">
          <div className="orders">
            <Button buttonType="inverted" onClick={handleRetrieveOrders}>
              my completed orders
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
                          {value.length < 4 ? "0" + value : value}{" "}
                          {" " + currency}
                        </p>
                      </li>
                    );
                  })
                )}
              </ol>
            )}
          </div>
          <div className="saved-cards">
            <Button buttonType="inverted" onClick={handleRetrieveSavedCards}>
              my saved cards
            </Button>
            {showSavedCards && (
              <div>
                {savedCards.length < 1 ? (
                  <>
                    <p>You have no saved cards yet. Want to add one? </p>
                  </>
                ) : (
                  savedCards.map((savedCard, i) => {
                    let {
                      last4,
                      brand,
                      cardholder_name,
                      expiry_month,
                      expiry_year,
                    } = savedCard.method_details;
                    return (
                      <div key={i} className="saved-card">
                        <span className="card-brand">{brand}</span>
                        <p>XXXX-XXXX-XXXX-{last4}</p>
                        <span className="expiry-date-and-cardholder-name">
                          <p>
                            {expiry_month}/{expiry_year.toString().slice(2)}
                          </p>
                          <p>{cardholder_name}</p>
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignedInPage;

import { useSelector, useDispatch } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectCurrentUser } from "../../store/user/user-selector";
import { setCurrentUser } from "../../store/user/user-actions";
import { apiClientRevolut } from "../../utils/revolut-API.utils";
import { useEffect, useState } from "react";
import Button from "../button/button.component";
import { Link } from "react-router-dom";
import {
  RETRIEVE_ORDER_LIST,
  RETRIEVE_CUSTOMER_PAYMENT_METHODS,
  DELETE_SAVED_PAYMENT_METHOD,
} from "../../utils/revolut-API-constants.utils";
import RevolutCheckout from "@revolut/checkout";

import "./signed-in-page.styles.scss";
import {
  clearOrderId,
  createOrderIdAsync,
} from "../../store/cart/cart-actions";
import { currencySelector } from "../../store/cart/cart-selectors";

const SignedInPage = () => {
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [savedCards, setSavedCards] = useState(false);
  const [showSavedCards, setshowSavedCards] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currency = useSelector(currencySelector);
  let { email, displayName, revolutCustomerId } = currentUser;
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  let firstName = displayName.split(" ")[0];

  useEffect(() => {
    handleRetrieveOrders();
    handleRetrieveSavedCards();
  }, []);

  const handleRetrieveOrders = async () => {
    try {
      const ordersList = await apiClientRevolut(
        "GET",
        { email, state: "COMPLETED" },
        RETRIEVE_ORDER_LIST
      );
      setOrders(ordersList);
    } catch (error) {
      console.error("There was a problem retrieving the orders list: ", error);
    }
  };

  const handleRetrieveOrdersButtonClick = () => {
    setShowOrders(!showOrders);
  };

  const handleRetrieveSavedCards = async () => {
    try {
      const savedCards = await apiClientRevolut(
        "GET",
        { revolutCustomerId },
        RETRIEVE_CUSTOMER_PAYMENT_METHODS
      );
      const mappedSavedCards = savedCards.map((savedCard, i) => {
        let { last4, brand, cardholder_name, expiry_month, expiry_year } =
          savedCard.method_details;
        let { id } = savedCard;
        return { id, last4, brand, cardholder_name, expiry_month, expiry_year };
      });

      dispatch(
        setCurrentUser({
          ...currentUser,
          savedPaymentMethods: mappedSavedCards,
        })
      );
      setSavedCards(mappedSavedCards);
    } catch (err) {
      console.error(
        "There was a problem retrieving the payment methods list: ",
        err
      );
    }
  };

  const handleRetrieveSavedCardsButtonClick = () => {
    setshowSavedCards(!showSavedCards);
  };
  const handleDeleteSavedCard = async (paymentMethodId) => {
    try {
      await apiClientRevolut(
        "DELETE",
        { revolutCustomerId, paymentMethodId },
        DELETE_SAVED_PAYMENT_METHOD
      );
      await handleRetrieveSavedCards();
    } catch (error) {
      console.error("There was a problem deleting the saved card: ", error);
    }
  };
  const handleAddACard = async () => {
    let order = await dispatch(
      createOrderIdAsync({
        amount: 0,
        currency,
        customer: { id: revolutCustomerId },
      })
    );
    RevolutCheckout(order.token, "sandbox").then(function (instance) {
      instance.payWithPopup({
        onSuccess() {
          alert("Card added successfully!");
          handleRetrieveSavedCards();
          dispatch(clearOrderId());
        },
        onError(message) {
          alert("Something went wrong when trying to save your card. :(");
        },
        savePaymentMethodFor: "customer",
        email: email,
        name: displayName,
      });
    });
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
            <Button
              buttonType="inverted"
              onClick={handleRetrieveOrdersButtonClick}
            >
              my completed orders
            </Button>
            {showOrders && (
              <ol>
                {orders?.length < 1 ? (
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
            <Button
              buttonType="inverted"
              onClick={handleRetrieveSavedCardsButtonClick}
            >
              my saved cards
            </Button>
            {showSavedCards && (
              <div>
                {savedCards?.length < 1 ? (
                  <>
                    <p>You have no saved cards yet. Want to add one? </p>
                    <Button onClick={handleAddACard} buttonType="inverted">
                      add a card
                    </Button>
                  </>
                ) : (
                  <div>
                    {savedCards.map((savedCard, i) => {
                      let {
                        id,
                        last4,
                        brand,
                        cardholder_name,
                        expiry_month,
                        expiry_year,
                      } = savedCard;
                      return (
                        <div key={i} className="saved-card">
                          <div className="brand-and-delete-icon">
                            <span className="card-brand">{brand}</span>
                            <DeleteIcon
                              onClick={() => handleDeleteSavedCard(id)}
                              className="svg-icon svg-icon__trashcan"
                            />
                          </div>
                          <p>XXXX-XXXX-XXXX-{last4}</p>
                          <span className="expiry-date-and-cardholder-name">
                            <p>
                              {expiry_month}/{expiry_year.toString().slice(2)}
                            </p>
                            <p>{cardholder_name}</p>
                          </span>
                        </div>
                      );
                    })}
                    <p>Want to add another card?</p>
                    <Button onClick={handleAddACard} buttonType="inverted">
                      add a card
                    </Button>
                  </div>
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

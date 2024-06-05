import { useDispatch, useSelector } from "react-redux";
import Button from "../button/button.component";
import RevolutCheckout from "@revolut/checkout";
import {
  createOrderIdAsync,
  payWithSavedPaymentMethodAsync,
} from "../../store/cart/cart-actions";
import { useEffect, useState } from "react";
import { selectCurrentUser } from "../../store/user/user-selector";
import "./payment-methods.styles.scss";
import { cartOrderId } from "../../store/cart/cart-selectors";

const PaymentMethods = ({ orderDetails }) => {
  const dispatch = useDispatch();
  const [saveCardForPopup, setSaveCardForPopup] = useState(false);
  const [showSavedCards, setshowSavedCards] = useState(false);
  const baseURL = window.location.origin;
  const signedInUser = useSelector(selectCurrentUser);
  const reduxOrderId = useSelector(cartOrderId);
  let { amount, currency } = orderDetails;
  if (signedInUser) {
    orderDetails = {
      ...orderDetails,
      customer: { id: signedInUser?.revolutCustomerId },
    };
  }

  const handleSaveCardForPopupCheck = (e) => {
    setSaveCardForPopup(e.target.checked);
  };

  const handlePayWithASavedCard = () => {
    setshowSavedCards(!showSavedCards);
  };

  const handleSelectCardToPay = (paymentMethodId, last4) => {
    const userConfirmation = window.confirm(
      `Do you want to use card ending in ${last4} for payment? Select "ok" to make payment`
    );

    if (userConfirmation) {
      handlePayWithSavedCard(paymentMethodId);
    }
  };
  const handlePayWithSavedCard = async (paymentMethodId) => {
    if (reduxOrderId.length) {
      let orderId = reduxOrderId;
      await dispatch(
        payWithSavedPaymentMethodAsync({
          ...orderDetails,
          paymentMethodId,
          orderId,
        })
      );
    } else {
      let orderId = await dispatch(createOrderIdAsync(orderDetails));
      await dispatch(
        payWithSavedPaymentMethodAsync({
          ...orderDetails,
          paymentMethodId,
          orderId: orderId.id,
        })
      );
    }
  };

  const handlePayWithPopup = async (orderDetails) => {
    let order = await dispatch(createOrderIdAsync(orderDetails));
    RevolutCheckout(order.token, "sandbox").then(function (instance) {
      instance.payWithPopup({
        onSuccess() {
          window.location.replace(`${baseURL}/success`);
        },
        onError(message) {
          window.location.replace(`${baseURL}/failure`);
        },
        savePaymentMethodFor: saveCardForPopup ? "customer" : false,
        email: signedInUser ? signedInUser?.email : null,
        name: signedInUser ? signedInUser?.displayName : null,
      });
    });
  };

  useEffect(() => {
    let canceled = false;
    let revolutPay = null;
    RevolutCheckout.payments({
      locale: "en",
      mode: "sandbox",
      publicToken: process.env.REACT_APP_REVOLUT_PK,
    }).then((paymentInstance) => {
      if (canceled) {
        return;
      }

      const paymentOptions = {
        currency,
        totalAmount: orderDetails.amount,
        redirectUrls: {
          success: `${baseURL}/success`,
          failure: `${baseURL}/failure`,
          cancel: `${baseURL}/checkout`,
        },
        createOrder: async () => {
          let order = await dispatch(createOrderIdAsync(orderDetails));
          return { publicId: order.token };
        },
        buttonStyle: {
          cashback: false,
          radius: "none",
        },
      };

      revolutPay = paymentInstance.revolutPay;
      revolutPay.mount(document.getElementById("revolutPay"), paymentOptions);
    });

    return () => {
      canceled = true;
      revolutPay?.destroy();
    };
  }, [amount, currency]);

  return (
    <div className="payment-methods">
      <div className="pay-wtih-popup-container">
        <Button onClick={() => handlePayWithPopup(orderDetails)}>
          {signedInUser ? "Pay with a new card" : "Pay with card"}
        </Button>
        {signedInUser && (
          <div className="save-card-checkbox">
            <input
              onChange={(e) => handleSaveCardForPopupCheck(e)}
              type="checkbox"
              id="pop-up-save-card"
            />
            <label>Save this card for future payments?</label>
          </div>
        )}
      </div>
      {signedInUser?.savedPaymentMethods.length > 0 && (
        <Button onClick={handlePayWithASavedCard}>Pay with a saved card</Button>
      )}
      {showSavedCards &&
        signedInUser?.savedPaymentMethods.map((savedCard, i) => {
          let { id, last4, brand, expiry_month, expiry_year } = savedCard;
          return (
            <div
              onClick={() => handleSelectCardToPay(id, last4)}
              key={i}
              className="saved-card-checkout-page"
            >
              <span>&#x2022;&#x2022;&#x2022;&#x2022;-{last4}</span>
              <span>
                {" " + expiry_month}/{expiry_year.toString().slice(2)}
              </span>
              {brand === "VISA" ? (
                <img
                  src="https://s13emagst.akamaized.net/assets/ro/css/font-icons/flag-icons/visa.svg?v1"
                  alt="visa-logo"
                ></img>
              ) : (
                <img
                  src="https://s13emagst.akamaized.net/assets/ro/css/font-icons/flag-icons/mastercard.svg?v1"
                  alt="mastercard-logo"
                ></img>
              )}
            </div>
          );
        })}
      <div id="revolutPay"></div>
    </div>
  );
};

export default PaymentMethods;

import { useDispatch } from "react-redux";
import Button from "../button/button.component";
import RevolutCheckout from "@revolut/checkout";
import { createOrderIdAsync } from "../../store/cart/cart-actions";
import { useEffect, useState } from "react";
import "./payment-methods.styles.scss";

const PaymentMethods = ({ orderDetails }) => {
  const dispatch = useDispatch();
  const [saveCardForPopup, setSaveCardForPopup] = useState(false);
  const baseURL = window.location.origin;

  let { amount, currency } = orderDetails;

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
      });
    });
  };

  const handleSaveCardForPopupCheck = (e) => {
    setSaveCardForPopup(e.target.checked);
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
          Pay with a new card
        </Button>
        <div className="save-card-checkbox">
          <input
            onChange={(e) => handleSaveCardForPopupCheck(e)}
            for="pop-up-save-card"
            type="checkbox"
            id="pop-up-save-card"
          />
          <label>Save this card for future payments?</label>
        </div>
      </div>
      <Button>Pay with a saved card</Button>
      <div id="revolutPay"></div>
    </div>
  );
};

export default PaymentMethods;

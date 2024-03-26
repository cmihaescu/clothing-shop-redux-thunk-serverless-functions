import { CheckoutItem } from "../../components/checkout-item/checkout-item.component";
import "./checkout.styles.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  currencySelector,
  cartItemsSelector,
  cartTotalPriceSelector,
} from "../../store/cart/cart-selectors";
import { createOrderIdAsync } from "../../store/cart/cart-actions";
import RevolutCheckout from "@revolut/checkout";
import { useEffect } from "react";

export const Checkout = () => {
  const dispatch = useDispatch();
  const currency = useSelector(currencySelector);
  const cartItems = useSelector(cartItemsSelector);
  const totalPrice = useSelector(cartTotalPriceSelector);

  useEffect(() => {
    let canceled = false;
    let revolutPay = null;
    let orderDetails = {
      amount: totalPrice * 100,
      currency,
    };
    RevolutCheckout.payments({
      locale: "en", // Optional, defaults to 'en'
      mode: "sandbox", // Optional, defaults to 'prod'
      publicToken: process.env.REACT_APP_REVOLUT_PK, // Merchant public API key
    }).then((paymentInstance) => {
      if (canceled) {
        return;
      }

      const paymentOptions = {
        currency, // 3-letter currency code
        totalAmount: orderDetails.amount, // in lowest denomination e.g., cents
        redirectUrls: {
          success: "http://localhost:8888/success",
          failure: "http://localhost:8888/failure",
          cancel: "http://localhost:8888/checkout",
        },
        createOrder: async () => {
          let order = await dispatch(createOrderIdAsync(orderDetails));
          return { publicId: order.token };
        },
      };

      revolutPay = paymentInstance.revolutPay;
      revolutPay.mount(document.getElementById("revolutPay"), paymentOptions);
    });

    return () => {
      canceled = true;
      revolutPay?.destroy();
    };
  }, [totalPrice, currency]);

  return (
    <div>
      {cartItems.length > 0 ? (
        <>
          <div className="table-columns">
            <span>Product</span>
            <span>Description</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Remove</span>
          </div>
          {cartItems.map((item) => (
            <CheckoutItem key={item.id} product={item} />
          ))}
          <div className="totalPriceBox">
            TOTAL: {totalPrice} {currency}
          </div>
          <div id="revolutPay"></div>
        </>
      ) : (
        <h3>You have no items in your cart</h3>
      )}
    </div>
  );
};

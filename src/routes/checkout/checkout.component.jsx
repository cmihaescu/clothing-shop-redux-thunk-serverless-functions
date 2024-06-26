import { CheckoutItem } from "../../components/checkout-item/checkout-item.component";
import "./checkout.styles.scss";
import { useSelector } from "react-redux";
import {
  currencySelector,
  cartItemsSelector,
  cartTotalPriceSelector,
} from "../../store/cart/cart-selectors";
import PaymentMethods from "../../components/payment-methods/payment-methods.component";

export const Checkout = () => {
  const currency = useSelector(currencySelector);
  const cartItems = useSelector(cartItemsSelector);
  const totalPrice = useSelector(cartTotalPriceSelector);

  let orderDetails = {
    amount: totalPrice * 100,
    currency,
  };

  return (
    <div className="checkout-container">
      {cartItems.length > 0 ? (
        <>
          <div className="table-columns">
            <span>Product</span>
            <span className="checkout-product-description">Description</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Remove</span>
          </div>
          {cartItems.map((item) => (
            <CheckoutItem key={item.id} product={item} />
          ))}
          <div className="totalPriceBox">
            TOTAL: {Math.round(Number(totalPrice) * 100) / 100} {currency}
          </div>
          <PaymentMethods orderDetails={orderDetails} />
        </>
      ) : (
        <h3>You have no items in your cart</h3>
      )}
    </div>
  );
};

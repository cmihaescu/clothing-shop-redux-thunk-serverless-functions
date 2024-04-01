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
          <PaymentMethods orderDetails={orderDetails} />
        </>
      ) : (
        <h3>You have no items in your cart</h3>
      )}
    </div>
  );
};

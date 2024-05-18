import "./product-card.styles.scss";
import Button from "../button/button.component";
import { useDispatch, useSelector } from "react-redux";
import {
  currencySelector,
  cartItemsSelector,
} from "../../store/cart/cart-selectors";
import { addItemToCart } from "../../store/cart/cart-reducer";
import { updateCartItemsReducer } from "../../store/cart/cart-reducer";
import { useState } from "react";

export const ProductCard = ({ product }) => {
  const [addedToCartAnimation, setAddedToCartAnimation] = useState(false);
  const { name, price, imageUrl } = product;
  const dispatch = useDispatch();
  const currency = useSelector(currencySelector);
  const cartItems = useSelector(cartItemsSelector);
  const handleAddProductToCartClick = () => {
    setAddedToCartAnimation(true);
    setTimeout(() => setAddedToCartAnimation(false), 750);
    dispatch(updateCartItemsReducer(addItemToCart(cartItems, product)));
  };

  return (
    <div className="product-card-container">
      <img src={imageUrl} alt={`${name}`}></img>
      <div className="footer">
        <span className="name">{name}</span>
        <span className="price-and-currency">
          {" "}
          {price} &nbsp; {currency}
        </span>
      </div>
      <Button
        buttonType={
          addedToCartAnimation
            ? "invertedWithConfirmItemAddedAnimation"
            : "inverted"
        }
        onClick={handleAddProductToCartClick}
      >
        {addedToCartAnimation ? "Added" : "Add to cart"}
      </Button>
    </div>
  );
};

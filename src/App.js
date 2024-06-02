import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Shop from "./routes/shop/shop.component";
import { Route, Routes } from "react-router-dom";
import Authentication from "./routes/authentication/authentication.component.jsx";
import { Checkout } from "./routes/checkout/checkout.component";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { OrderConfirmationPage } from "./routes/order-confirmation-page/order-confirmation-page.component";
import { cartOrderId } from "./store/cart/cart-selectors";
import {
  setCartDropdown,
  setMobileNavigationDropdown,
} from "./store/cart/cart-actions.js";

const App = () => {
  const orderId = useSelector(cartOrderId);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      const mobileMenuIcon = document.getElementById("mobile-menu-icon-div");
      const mobileNavigationDropdown = document.getElementById(
        "mobile-navigation-menu-dropdown"
      );
      const cartDropdown = document.getElementById("cart-dropdown-container");
      const cartIcon = document.getElementById("cart-dropdown-icon-div");
      if (
        mobileMenuIcon &&
        mobileNavigationDropdown &&
        !mobileMenuIcon.contains(e.target) &&
        !mobileNavigationDropdown.contains(e.target)
      ) {
        dispatch(setMobileNavigationDropdown(false));
      }
      if (
        cartDropdown &&
        cartIcon &&
        !cartDropdown.contains(e.target) &&
        !cartIcon.contains(e.target)
      ) {
        dispatch(setCartDropdown(false));
      }
    });

    return () => {
      window.removeEventListener("click", (e) => {
        console.log("removed window click event listener");
      });
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />}></Route>
        <Route path="shop/*" element={<Shop />}></Route>
        <Route path="authentication" element={<Authentication />}></Route>
        <Route path="checkout" element={<Checkout />}></Route>
        <Route
          path="success"
          element={<OrderConfirmationPage orderId={orderId} />}
        ></Route>
        <Route
          path="failure"
          element={<OrderConfirmationPage orderId={orderId} />}
        ></Route>
        <Route
          path="cancellation"
          element={<OrderConfirmationPage orderId={orderId} />}
        ></Route>
      </Route>
    </Routes>
  );
};

export default App;

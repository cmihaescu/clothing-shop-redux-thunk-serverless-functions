import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Shop from "./routes/shop/shop.component";
import { Route, Routes } from "react-router-dom";
import Authentication from "./routes/authentication/authentication.component.jsx";
import { Checkout } from "./routes/checkout/checkout.component";
import { useEffect } from "react";
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from "./utils/firebase.utils";
import { setCurrentUser } from "./store/user/user-actions";
import { useDispatch, useSelector } from "react-redux";
import { OrderConfirmationPage } from "./routes/order-confirmation-page/order-confirmation-page.component";
import { cartOrderId } from "./store/cart/cart-selectors";

const App = () => {
  const dispatch = useDispatch();
  const orderId = useSelector(cartOrderId);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
      }
      dispatch(setCurrentUser(user));
    });
    return unsubscribe;
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

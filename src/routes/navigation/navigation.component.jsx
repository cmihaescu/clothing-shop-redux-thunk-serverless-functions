import "./navigation.styles.scss";
import { Fragment } from "react";
import { Outlet, Link } from "react-router-dom";
import revolutLogo from "../../assets/Revolut-Logo.png";
import { signOutUser } from "../../utils/firebase.utils";
import { CartIcon } from "../../components/cart-icon/cart-icon.component";
import { CartDropdown } from "../../components/cart-dropdown/cart-dropdown.component";
import CurrencySwitcher from "../../components/currency-switcher/currency-switcher.component";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { cartDropdownSelector } from "../../store/cart/cart-selectors";
import { setCurrentUser } from "../../store/user/user-actions";

const Navigation = () => {
  const currentUser = useSelector(selectCurrentUser);
  const cartDropdown = useSelector(cartDropdownSelector);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOutUser();
    dispatch(setCurrentUser(null));
  };

  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to="/">
          <img src={revolutLogo} alt="revolut-logo" className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to="/">
            Categories
          </Link>
          <Link className="nav-link" to="shop">
            Shop
          </Link>
          {currentUser ? (
            <>
              <Link className="nav-link" to="authentication">
                My Account
              </Link>
              <Link className="nav-link" onClick={handleSignOut}>
                Sign Out
              </Link>
            </>
          ) : (
            <Link className="nav-link" to="authentication">
              Sign In
            </Link>
          )}
          <CartIcon />
          <CurrencySwitcher />
        </div>
        {cartDropdown && <CartDropdown />}
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;

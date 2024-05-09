import "./navigation.styles.scss";
import { Fragment } from "react";
import { Outlet, Link } from "react-router-dom";
import revolutLogo from "../../assets/Revolut-Logo.png";
import RLogo from "../../assets/R-Logo.png";
import MenuIcon from "../../assets/menu.svg";
import { signOutUser } from "../../utils/firebase.utils";
import { CartIcon } from "../../components/cart-icon/cart-icon.component";
import { CartDropdown } from "../../components/cart-dropdown/cart-dropdown.component";
import CurrencySwitcher from "../../components/currency-switcher/currency-switcher.component";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import {
  cartDropdownSelector,
  mobileNavigationDropdownSelector,
} from "../../store/cart/cart-selectors";
import { setCurrentUser } from "../../store/user/user-actions";
import { setMobileNavigationDropdown } from "../../store/cart/cart-actions";
import MobileNavigationMenu from "../../components/mobile-navigation-menu/mobile-navigation-menu.component";
import scssVariables from "../../utils/_variables.scss";

const Navigation = () => {
  const currentUser = useSelector(selectCurrentUser);
  const cartDropdown = useSelector(cartDropdownSelector);
  const mobileNavigationDropdown = useSelector(
    mobileNavigationDropdownSelector
  );
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOutUser();
    dispatch(setCurrentUser(null));
  };
  const handleMobileMenuIconClick = () => {
    dispatch(setMobileNavigationDropdown(!mobileNavigationDropdown));
  };
  const mobileBreakpoint = parseInt(scssVariables.mobileBreakpoint, 10);
  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to="/">
          {window.innerWidth < mobileBreakpoint ? (
            <img src={RLogo} alt="r-logo" className="r-logo" />
          ) : (
            <img
              src={revolutLogo}
              alt="revolut-logo"
              className="revolut-logo"
            />
          )}
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
        </div>
        <div className="cart-and-currency-container">
          <CurrencySwitcher />
          <CartIcon />
          <div className="mobile-navigation-menu">
            <img
              onClick={handleMobileMenuIconClick}
              src={MenuIcon}
              alt="menu"
              className={
                mobileNavigationDropdown
                  ? "rotate-menu-icon"
                  : "reverse-rotate-menu-icon"
              }
            />
            {mobileNavigationDropdown && <MobileNavigationMenu />}
          </div>
        </div>
        {cartDropdown && <CartDropdown />}
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;

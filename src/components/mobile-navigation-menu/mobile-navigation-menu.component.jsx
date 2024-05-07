import "./mobile-navigation-menu.styles.scss";
import { Link } from "react-router-dom";
import { signOutUser } from "../../utils/firebase.utils";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { setCurrentUser } from "../../store/user/user-actions";
import { setMobileNavigationDropdown } from "../../store/cart/cart-actions";

const MobileNavigationMenu = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const handleSignOut = () => {
    signOutUser();
    dispatch(setCurrentUser(null));
  };
  const handleMobileNavLinkClick = () => {
    dispatch(setMobileNavigationDropdown(false));
  };
  return (
    <div className="mobile-navigation-menu">
      <div className="nav-links-mobile-container">
        <Link className="nav-link" to="/" onClick={handleMobileNavLinkClick}>
          Categories
        </Link>
        <Link className="nav-link" to="shop" onClick={handleMobileNavLinkClick}>
          Shop
        </Link>
        {currentUser ? (
          <>
            <Link
              className="nav-link"
              to="authentication"
              onClick={handleMobileNavLinkClick}
            >
              My Account
            </Link>
            <Link className="nav-link" onClick={handleSignOut}>
              Sign Out
            </Link>
          </>
        ) : (
          <Link
            className="nav-link"
            to="authentication"
            onClick={handleMobileNavLinkClick}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileNavigationMenu;

import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import SignedInPage from "../../components/sign-in-page/SignedInPage.component";
import "../../components/button/button.styles.scss";
import "./authentication.styles.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";

const Authentication = () => {
  const currentUser = useSelector(selectCurrentUser);
  // console.log("currentUser in authentication page", currentUser.email);
  // aicia inca nu il are
  return (
    <div className="authentication-container">
      {currentUser ? (
        <SignedInPage />
      ) : (
        <>
          <SignInForm />
          <SignUpForm />
        </>
      )}
    </div>
  );
};

export default Authentication;

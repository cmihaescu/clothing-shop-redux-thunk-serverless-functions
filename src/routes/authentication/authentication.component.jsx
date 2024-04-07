import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import SignedInPage from "../../components/sign-in-page/signed-in-page.component";
import "../../components/button/button.styles.scss";
import "./authentication.styles.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";

const Authentication = () => {
  const currentUser = useSelector(selectCurrentUser);
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

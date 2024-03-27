import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";

const SignedInPage = () => {
  let user = useSelector(selectCurrentUser);
  let userFirstName = "";
  let userLastName = "";
  user.displayName
    ? (userFirstName = user.displayName.split(" ")[0])
    : (userFirstName = " ");
  user.displayName
    ? (userLastName = user.displayName.split(" ")[1])
    : (userLastName = " ");

  return (
    <div className="SignedInPage">
      <h1>Welcome {userFirstName}!</h1>
      <h3>Page still in construction</h3>
    </div>
  );
};

export default SignedInPage;

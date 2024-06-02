import Button from "../button/button.component";
import FormInput from "../form-input/form-input.component";
import {
  signInWithGooglePopup,
  signInWithEmailAndPasswordMethod,
  createUserDocumentFromAuth,
  getUserFromFirebase,
} from "../../utils/firebase.utils";
import "./sign-in-form.styles.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../store/user/user-actions";
import { apiClientRevolut } from "../../utils/revolutAPI.utils";

const initialFormField = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(initialFormField);
  const { email, password } = formFields;
  const resetFormFields = () => setFormFields(initialFormField);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { user } = await signInWithEmailAndPasswordMethod(email, password);
      dispatch(setCurrentUser(user));
      console.log("user successfully logged in");
      resetFormFields();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong password":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user assocatied with this email");
          break;
        default:
          alert(error.code);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const signInWithGoogle = async () => {
    const googleUser = await signInWithGooglePopup();
    const { email, displayName, uid } = googleUser.user;
    let firebaseGoogleUser = await getUserFromFirebase(uid)
      .then((user) => {
        return user;
      })
      .catch((error) =>
        console.error(
          "There was an error in retrieving user from firebase",
          error
        )
      );
    console.log("user retrieved from firebase", firebaseGoogleUser);
    if (!firebaseGoogleUser) {
      console.log("there is no firebase user");
      let revolutCustomer = await apiClientRevolut(
        "POST",
        { email, full_name: displayName },
        "create_customer"
      );
      createUserDocumentFromAuth(googleUser.user, {
        displayName,
        revolutCustomerId: revolutCustomer.id,
      });
      googleUser.user.revolutCustomerId = revolutCustomer.id;
      dispatch(setCurrentUser(googleUser.user));
    } else {
      console.log("there is a firebase user");
      firebaseGoogleUser.revolutCustomerId =
        firebaseGoogleUser.revolutCustomerId.stringValue;
      firebaseGoogleUser.createdAt =
        firebaseGoogleUser.createdAt.timestampValue;
      firebaseGoogleUser.displayName =
        firebaseGoogleUser.displayName.stringValue;
      firebaseGoogleUser.email = firebaseGoogleUser.email.stringValue;
      //this needs to be redone ^^ - most likely change the retrive method from firebase db or create a formatting function
      dispatch(setCurrentUser(firebaseGoogleUser));
    }
  };

  return (
    <div className="sign-up-container">
      <h2>I already have an account</h2>
      <span> Sign in with email and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="text"
          required
          onChange={handleChange}
          name="email"
          value={email}
        ></FormInput>
        <FormInput
          label="Password"
          type="password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        ></FormInput>
        <div className="sign-in-form-button-container">
          <Button type="submit">Sign In</Button>
          <Button
            type="button"
            buttonType={"google"}
            onClick={signInWithGoogle}
          >
            Google Sign In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;

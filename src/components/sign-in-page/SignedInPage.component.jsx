import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { apiClientRevolutOrders } from "../../utils/revolutAPI.utils";
import Button from "../button/button.component";
import { useEffect, useState } from "react";
import { getUserFromFirebase } from "../../utils/firebase.utils";

const SignedInPage = () => {
  const [orders, setOrders] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, seLastName] = useState("");
  let user = useSelector(selectCurrentUser);
  let { uid, email, displayName } = user;

  // useEffect(() => {
  //   getUserFromFirebase(uid)
  //     .then((firebaseUser) => {
  //       if (!email) {
  //         email = firebaseUser.email.stringValue;
  //       }
  //       if (!displayName) {
  //         displayName = firebaseUser.displayName.stringValue;
  //       }
  //       if (displayName) {
  //         displayName =
  //           displayName.charAt(0).toUpperCase() + displayName.slice(1);
  //         setFirstName(displayName.split(" ")[0]);
  //         seLastName(displayName.split(" ")[1]);
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // }, []);

  const handleRetrieveOrders = async () => {
    try {
      const ordersList = await apiClientRevolutOrders(
        "GET",
        { email, state: "COMPLETED" },
        "retrieve_order_list"
      );
      setOrders(ordersList);
    } catch (error) {
      console.error("There was a problem retrieving the orders list: ", error);
    }
  };
  return (
    <div className="SignedInPage">
      {/* <h1>Welcome {firstName.length ? firstName : " to your account page"}!</h1> */}
      <h1>{displayName}</h1>
      <h3>Page still in construction</h3>
      <Button onClick={handleRetrieveOrders}>Retrieve my orders</Button>
      <p>Signed in with email: {email}</p>
      {orders.length ? (
        <div>
          Your completed orders:
          <ol>
            {orders.map((order, i) => {
              return <li key={i}>{order.id}</li>;
            })}
          </ol>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SignedInPage;

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { apiClientRevolutOrders } from "../../utils/revolutAPI.utils";
import Button from "../button/button.component";
import { or } from "firebase/firestore";
import { useState } from "react";

const SignedInPage = () => {
  const [orders, setOrders] = useState([]);
  let user = useSelector(selectCurrentUser);
  let { email } = user;
  let userFirstName = "";
  let userLastName = "";
  user.displayName
    ? (userFirstName = user.displayName.split(" ")[0])
    : (userFirstName = " ");
  user.displayName
    ? (userLastName = user.displayName.split(" ")[1])
    : (userLastName = " ");

  const handleRetrieveOrders = async () => {
    try {
      const ordersList = await apiClientRevolutOrders(
        "GET",
        { email, state: "COMPLETED" },
        "retrieve_order_list"
      );
      console.log("ordersList", ordersList);
      setOrders(ordersList);
    } catch (error) {
      console.error("There was a problem retrieving the orders list: ", error);
    }
  };

  return (
    <div className="SignedInPage">
      <h1>Welcome {userFirstName}!</h1>
      <h3>Page still in construction</h3>
      <Button onClick={handleRetrieveOrders}>Retrieve my orders</Button>
      <p>Signed in with email: {email}</p>
      <div>
        <ol>
          {orders.map((order, i) => {
            return <li key={i}>{order.id}</li>;
          })}
        </ol>
      </div>
    </div>
  );
};

export default SignedInPage;

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user-selector";
import { apiClientRevolutOrders } from "../../utils/revolutAPI.utils";
import Button from "../button/button.component";
import { useState } from "react";

const SignedInPage = () => {
  const [orders, setOrders] = useState([]);
  const currentUser = useSelector(selectCurrentUser);
  let { email, displayName, uid } = currentUser;

  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  let firstName = displayName.split(" ")[0];
  let lastName = displayName.split(" ")[1];

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
      <h1>Welcome {firstName.length ? firstName : " to your account page"}!</h1>
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

import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userActions } from "../../../actions/userActions.js";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";

const UserListScreen = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { usersLoading, users, usersError } = useSelector(
    (state) => state.user
  );

  const [deletedMsg, setDeletedMsg] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [blockStatusLoading, setBlockStatusLoading] = useState("");

  useEffect(() => {
    dispatch(userActions.listUsers());
  }, []);

  const blockUnblockHandler = async (orderId, blockStatus) => {
    if (
      window.confirm(`Are you sure to ${blockStatus ? "Block" : "unblock"} ?`)
    ) {
      setBlockStatusLoading(true);
      let res = await dispatch(
        userActions.blockUnBlockUser(orderId, blockStatus)
      );
      console.log(res);

      if (res.statusCode === 200) {
        setStatusCode(200);
        setDeletedMsg(res.message);
        dispatch(userActions.listUsers());
      } else {
        setDeletedMsg(res.message);
        setStatusCode(400);
      }
      setTimeout(() => {
        setDeletedMsg("");
        setStatusCode("");
      }, 3000);
      setBlockStatusLoading(false);
    }
  };

  return (
    <div className="m-1">
      <h1>Users Lists</h1>
      {deletedMsg && (
        <MessageBox variant={`${statusCode === 200 ? `success` : "danger"} `}>
          {deletedMsg}
        </MessageBox>
      )}
      {blockStatusLoading && <LoadingBox />}
      {usersLoading ? (
        <LoadingBox />
      ) : usersError ? (
        <MessageBox variant="danger">{usersError}</MessageBox>
      ) : (
        <>
          <table className="table mx-1">
            <thead>
              <tr>
                <td>ID</td>
                <td>NAME</td>
                <td>EMAIL</td>
                <td>SELLER</td>
                <td>ADMIN</td>
                <td>BLOCKED</td>
                <td>ACTIONS</td>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isSeller ? "Seller" : "Not Seller"}</td>
                    <td>{user.isAdmin ? "Admin" : "Not Admin"}</td>
                    <td>{user.isBlocked ? "Blocked" : "Not Blocked"}</td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => history.push(`/edit-user/${user._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="small"
                        onClick={() =>
                          blockUnblockHandler(user._id, !user.isBlocked)
                        }
                      >
                        {!user.isBlocked ? "Block" : "Un Block"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserListScreen;

import React, { useEffect, useState } from "react";
import { useHttpClient } from "../hooks/http-hook";

import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import UserList from "../components/Users/UserList.js";

const Users = () => {
  //   we will send the request whenever this page load
  //   hence  we ue useEffect hook to not rerender the component
  //   it's not advised to use async await as a function inside the useEffect hook
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData= await sendRequest("http://localhost:5000/api/users/");
        // console.log(responseData.users);
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </>
  );
};

export default Users;

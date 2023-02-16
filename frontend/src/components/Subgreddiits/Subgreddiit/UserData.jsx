import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { axiosPrivate } from "../../../api/axios";
import Loading from "../../Loading";
import Navbar from "../../Navbar";

const debug = false;

const UserData = () => {
  const { name } = useParams();

  const getUserData = async () => {
    try {
      const response = await axiosPrivate.get(`/api/gr/users/${name}`);
      if (debug) console.log(response.data);
      return response.data;
    } catch (err) {
      if (debug) console.log(err);
      return null;
    }
  };

  const usersQuery = useQuery({
    queryKey: ["users", name],
    queryFn: getUserData,
  });

  if (usersQuery.isLoading || !usersQuery?.data) {
    return <Loading />;
  }

  if (usersQuery.err) {
    return "Error fetching data";
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap justify-around">
        <div className="flex flex-col flex-wrap justify-center">
          <div className="divider">
            <div className="badge badge-accent text-lg">Not Blocked Users</div>
          </div>
          <ol className="list-decimal">
            {usersQuery.data.unblocked_followers.length > 0
              ? usersQuery.data.unblocked_followers.map((item) => (
                  <li
                    key={`${Math.random() * 100} - unblocked - ${
                      item.username
                    }`}
                  >
                    <Link to={`/u/${item.username}`}>{item.username}</Link>
                  </li>
                ))
              : "No unblocked followers"}
          </ol>
        </div>
        <div className="flex flex-col flex-wrap justify-center">
          <div className="divider">
            <div className="badge badge-accent text-lg">Blocked Users</div>
          </div>
          <ol className="list-decimal">
            {usersQuery.data.blocked_followers.length > 0
              ? usersQuery.data.blocked_followers.map((item) => (
                  <li
                    key={`${Math.random() * 100} - blocked - ${item.username}`}
                  >
                    <Link to={`/u/${item.username}`}>{item.username}</Link>
                  </li>
                ))
              : "No blocked followers"}
          </ol>
        </div>
      </div>
    </>
  );
};

export default UserData;

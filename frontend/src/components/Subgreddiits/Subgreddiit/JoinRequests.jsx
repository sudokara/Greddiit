import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { axiosPrivate } from "../../../api/axios";
import Loading from "../../Loading";
import Navbar from "../../Navbar";
import JoinRequestsCard from "./JoinRequestsCard";

const debug = true;

const JoinRequests = () => {
  const { name } = useParams();

  const getJoinRequests = async () => {
    try {
      const response = await axiosPrivate.get(`/api/gr/jreq/${name}`);
      if (debug) console.log(response.data);
      return response.data;
    } catch (err) {
      if (debug) console.error(err);
      return null;
    }
  };

  const joinRequestsQuery = useQuery({
    queryKey: ["jreqs", name],
    queryFn: getJoinRequests,
  });

  if (joinRequestsQuery.isLoading || !joinRequestsQuery?.data) {
    return <Loading />;
  }

  if (joinRequestsQuery.isError) {
    return "Error fetching data";
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap justify-around">
        {joinRequestsQuery.data.length ? (
          joinRequestsQuery.data.map((item) => (
            <div
              key={`${name}-jreq-${item.username}`}
              className="md:w-1/2 lg:w-1/3 xl:w-1/4 flex justify-center my-5"
            >
              <JoinRequestsCard username={item.username} subname={name} />
            </div>
          ))
        ) : (
          <div className="text-lg">No pending join requests</div>
        )}
      </div>
    </>
  );
};

export default JoinRequests;

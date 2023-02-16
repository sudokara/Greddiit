import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { RxCrossCircled } from "react-icons/rx";
import { AiOutlineCheckCircle } from "react-icons/ai";

const debug = false;

const JoinRequestsCard = ({ subname, username }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleChangeRequest = (status) => {
    setLoading(true);
    if (status !== "accepted" && status !== "rejected") {
      console.log(`invalid status ${status}`);
      return;
    }
    axiosPrivate
      .patch(`/api/gr/jreq/${subname}`, {
        username: username,
        status: status,
      })
      .then((response) => {
        if (debug) console.log(response.data);
      })
      .catch((err) => {
        if (debug) console.error(err);
      })
      .then(setLoading(false));
  };

  const joinRequestStatusMutation = useMutation({
    mutationFn: (status) => {
      handleChangeRequest(status);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["jreqs", subname]);
      }, 1000);
    },
  });

  return (
    <div className="flex w-full justify-center">
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">u/{username}</h2>
          <p>Has requested to join this subgreddiit</p>
          <div className="card-actions justify-end">
            <button
              className={`btn gap-2 btn-success ${loading ? "loading" : ""}`}
              onClick={() => joinRequestStatusMutation.mutate("accepted")}
            >
              <AiOutlineCheckCircle />
              Accept
            </button>
            <button
              className={`btn gap-2 btn-error ${loading ? "loading" : ""}`}
              onClick={() => joinRequestStatusMutation.mutate("rejected")}
            >
              <RxCrossCircled />
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRequestsCard;

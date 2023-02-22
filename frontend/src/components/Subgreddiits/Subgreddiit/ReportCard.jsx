import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";

const debug = true;

const ReportCard = ({ report }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [timerId, setTimerId] = useState(null);

  const handleAction = (action) => {
    if (action !== "ignore" && action !== "delete" && action !== "block") {
      console.error("Unknown action " + action);
      return;
    }
    setLoading(true);
    axiosPrivate
      .patch(`/api/report`, {
        reported_by: report.reported_by,
        reported_user: report.reported_user,
        post_id: report.post_id,
        action: action,
      })
      .then((response) => {
        if (debug) console.log(response.data);
      })
      .catch((err) => {
        if (debug) console.error(err);
      })
      .then(setLoading(false));
  };

  const actionMutation = useMutation({
    mutationFn: (action) => {
      handleAction(action);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["reports", report.subgreddiit]);
      }, 700);
    },
  });

  const blockButtonClick = () => {
    // if (countdown !== "Block") {
    //   setCountdown("Block");
    // } else {
    //   setCountdown("Cancel: 3");
    //   setTimeout(() => {
    //     setCountdown("Cancel: 2");
    //   }, 1000);
    //   setTimeout(() => {
    //     setCountdown("Cancel: 1");
    //   }, 1000);
    //   setTimeout(() => {
    //     actionMutation.mutate("block");
    //   }, 1000);
    // }
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    } else {
      const newTimer = setTimeout(() => {
        actionMutation.mutate("block");
        setTimerId(null);
      }, 3000);
      setTimerId(newTimer);
    }
  };

  useEffect(() => {
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [timerId]);

  return (
    <div className="flex w-full justify-center">
      <div className="card card-compact w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-red-500">u/{report.reported_user}</h2>
          <p>Posted by: u/{report.reported_by}</p>
          <p>Concern: {report.concern}</p>
          <p>Post Text: {report.post_text}</p>
          {report.status === "blocked" ? (
            <p className="text-red-500 text-lg">Blocked</p>
          ) : (
            <div className="card-actions justify-end">
              <button
                className={`btn gap-2 btn-accent ${loading ? "loading" : ""}`}
                disabled={report.status === "ignored"}
                onClick={() => actionMutation.mutate("delete")}
              >
                Delete Post
              </button>
              <button
                className={`btn gap-2 btn-info ${loading ? "loading" : ""}`}
                disabled={report.status === "ignored"}
                onClick={() => actionMutation.mutate("ignore")}
              >
                Ignore
              </button>
              <button
                className={`btn gap-2 btn-error ${loading ? "loading" : ""}`}
                disabled={report.status === "ignored"}
                onClick={blockButtonClick}
              >
                {countdown}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../../api/axios";

const debug = true;

const ReportCard = ({ report }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [buttonText, setButtonText] = useState("Block User");
  const [timerIds, setTimerIds] = useState([]);

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

  const blockButtonClick = async () => {
    if (timerIds.length) {
      // cancel
      timerIds.forEach((id) => clearTimeout(id));
      setTimerIds([]);
      setButtonText("Block User");
      return;
    }
    setButtonText("Cancel in 3s");

    const timer1 = setTimeout(() => {
      setButtonText("Cancel in 2s");
    }, 1000);

    const timer2 = setTimeout(() => {
      setButtonText("Cancel in 1s");
    }, 2000);

    const timer3 = setTimeout(() => {
      // done, block user
      setTimerIds([]);
      setButtonText("Block User");
      actionMutation.mutate("block");
    }, 3000);

    setTimerIds([timer1, timer2, timer3]);
  };

  useEffect(() => {
    return () => {
      timerIds.forEach((id) => clearTimeout(id));
    };
  }, [timerIds]);

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
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

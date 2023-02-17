import React from "react";
import { BsArrowRight, BsCardText, BsTrash } from "react-icons/bs";
import { RxEnvelopeOpen } from "react-icons/rx";
import { ImExit } from "react-icons/im";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";

const SubgreddiitCard = ({
  name,
  description,
  numPeople,
  numPosts,
  bannedKeywords,
  tags,
  actionLoading,
  setActionLoading,
  showLeave,
  showDelete,
  showDisabledLeave,
  image
}) => {
  const navigate = useNavigate();

  const username = jwt_decode(
    localStorage.getItem("greddiit-access-token")
  ).username;

  const queryClient = useQueryClient();

  const handleSubDelete = (subgr) => {
    // setActionLoading(true);
    axiosPrivate
      .delete(`/api/gr/delete/${subgr}`)
      .then((response) => console.log(response))
      .catch((err) => console.error(err))
      .then(setActionLoading(false));
  };

  const deleteSubMutation = useMutation({
    mutationFn: (subgr) => {
      handleSubDelete(subgr);
      // setActionLoading(false);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["mysubs", username]);
        queryClient.invalidateQueries(["allsubs", username]);
      }, 1000);
    },
  });

  const handleSubLeave = (subgr) => {
    // setActionLoading(true);
    axiosPrivate
      .get(`/api/gr/leave/${subgr}`)
      .then((response) => console.log(response))
      .catch((err) => console.error(err))
      .then(setActionLoading(false));
  };

  const leaveSubMutation = useMutation({
    mutationFn: (subgr) => {
      handleSubLeave(subgr);
      // setActionLoading(false);
    },
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["mysubs", username]);
        queryClient.invalidateQueries(["allsubs", username]);
      }, 1000);
    },
  });

  const handleAddJoinReq = (subgr) => {
    // setActionLoading(true);
    axiosPrivate
      .post(`/api/gr/jreq/${subgr}`)
      .then((response) => console.log(response))
      .catch((err) => {
        console.log(err);
        window.alert(err.response.data.message);
      });
  };

  const joinReqMutation = useMutation({
    mutationFn: (subgr) => {
      handleAddJoinReq(subgr);
      // setActionLoading(false);
    },
  });

  return (
    <div className="flex w-full">
      <div className="card card-compact w-96 m-5 bg-base-100 shadow-xl">
        <figure
          className="hover:cursor-pointer"
          onClick={() => navigate("/r/" + name)}
        >
          <img
            // src="https://source.unsplash.com/random"
            src={image || "https://source.unsplash.com/random"}
            width={384}
            style={{maxHeight: "384px"}}
            alt={`${name}`}
          />
        </figure>
        <div className="card-body">
          <h2 className="text-center font-bold text-3xl text-primary">
            r/{name}
          </h2>

          <p className="text-center text-lg">
            {description.length > 30
              ? description.slice(0, 30) + "..."
              : description}
          </p>

          <div className="flex flex-row justify-around text-xl font-semibold">
            <div>
              <FiUsers style={{ display: "inline" }} /> : {numPeople}
            </div>

            <div>
              <BsCardText style={{ display: "inline" }} /> : {numPosts}
            </div>
          </div>

          <div className="text-center text-lg">
            {bannedKeywords && bannedKeywords.length && bannedKeywords !== " "
              ? "Banned Keywords: " + bannedKeywords.join(", ")
              : "No Banned Keywords"}
          </div>

          <div
            className="card-actions justify-around"
            style={{ overflowX: "scroll" }}
          >
            {tags.map((tag, idx) => (
              <div
                key={`${Math.floor(Math.random() * 100)}-sub-${idx}-${tag}`}
                className="badge badge-outline badge-accent"
              >
                {tag}
              </div>
            ))}
          </div>

          <div className="flex flex-row justify-around">
            {showLeave ? (
              // leave sub button
              <div>
                <button
                  disabled={showDisabledLeave}
                  className={`btn btn-square btn-outline mt-3 ${
                    actionLoading ? "loading" : ""
                  }`}
                  onClick={(e) => {
                    setActionLoading(true);
                    leaveSubMutation.mutate(name);
                  }}
                >
                  <ImExit />
                </button>
              </div>
            ) : showDelete ? (
              // delete button
              <div>
                <button
                  className={`btn btn-square btn-outline mt-3 ${
                    actionLoading ? "loading" : ""
                  }`}
                  onClick={(e) => {
                    // e.preventDefault();
                    setActionLoading(true);
                    deleteSubMutation.mutate(name);
                  }}
                >
                  {actionLoading ? "" : <BsTrash />}
                </button>
              </div>
            ) : (
              // join request button
              <div>
                <button
                  className={`btn btn-square btn-outline mt-3 ${
                    actionLoading ? "loading" : ""
                  }`}
                  onClick={(e) => {
                    // setActionLoading(true);
                    joinReqMutation.mutate(name);
                  }}
                >
                  <RxEnvelopeOpen />
                </button>
              </div>
            )}

            <div>
              <button
                className={`btn btn-square btn-outline mt-3 ${
                  actionLoading ? "loading" : ""
                }`}
                onClick={() => navigate("/r/" + name)}
              >
                <BsArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubgreddiitCard;

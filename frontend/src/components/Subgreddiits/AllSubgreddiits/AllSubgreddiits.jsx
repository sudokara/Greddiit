import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosPrivate } from "../../../api/axios";
import jwt_decode from "jwt-decode";

import Navbar from "../../Navbar";
import Loading from "../../Loading";
import NotFound from "../../NotFound";
import SubgreddiitCard from "../SubgreddiitCard";

const debug = false;

const AllSubgreddiits = () => {
  const [username, setUsername] = useState(
    jwt_decode(localStorage.getItem("greddiit-access-token")).username
  );
  const [leaveLoading, setLeaveLoading] = useState(false);

  const getAllSubs = async () => {
    try {
      const response = await axiosPrivate.get("/api/gr/all");
      if (debug) {
        console.log(response.data.joined_subs);
        console.log(response.data.not_joined_subs);
      }
      return response.data;
    } catch (err) {
      if (debug) console.error(err);
      return null;
    }
  };

  const allSubsQuery = useQuery({
    queryKey: ["allsubs", username],
    queryFn: getAllSubs,
  });

  if (allSubsQuery.isLoading || !allSubsQuery.data) return <Loading />;

  if (allSubsQuery.isError) return <NotFound />;

  return (
    <>
      <Navbar />

      <div className="flex flex-col w-full justify-center">
        <div className="p-4 text-center flex flex-col w-full justify-center">
          <div className="flex justify-center border-red-600 border-2">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered"
                />
                <button className="btn btn-square">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-around">
            <div>tags</div>

            <div>sort</div>
          </div>
        </div>

        <div className="divider">
          <div className="badge badge-accent text-lg">Joined Subgreddiits</div>
        </div>

        {/* joined subs */}
        <div className="p-4 flex flex-row flex-wrap w-full justify-around">
          {allSubsQuery.data.joined_subs.map((sub, idx) => (
            <div
              key={`${Math.floor(Math.random() * 100)}-sub-${idx}-${sub?.name}`}
              className="md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <SubgreddiitCard
                name={sub?.name}
                description={sub?.description}
                numPeople={sub?.num_people}
                numPosts={sub?.num_posts}
                tags={Array.isArray(sub?.tags) ? sub?.tags : []}
                bannedKeywords={
                  Array.isArray(sub?.banned_keywords)
                    ? sub?.banned_keywords
                    : []
                }
                showLeave={true}
                showDisabledLeave={sub?.creator === username}
                showDelete={false}
                actionLoading={leaveLoading}
                setActionLoading={setLeaveLoading}
              />
            </div>
          ))}
        </div>

        <div className="divider">
          <div className="badge badge-accent text-lg">
            Not Joined Subgreddiits
          </div>
        </div>

        {/* not joined subs */}
        <div className="p-4 flex flex-row flex-wrap w-full justify-around">
          {allSubsQuery.data.not_joined_subs.map((sub, idx) => (
            <div
              key={`${Math.floor(Math.random() * 100)}-sub-${idx}-${sub?.name}`}
              className="md:w-1/2 lg:w-1/3 xl:w-1/4"
            >
              <SubgreddiitCard
                name={sub?.name}
                description={sub?.description}
                numPeople={sub?.num_people}
                numPosts={sub?.num_posts}
                tags={Array.isArray(sub?.tags) ? sub?.tags : []}
                bannedKeywords={
                  Array.isArray(sub?.banned_keywords)
                    ? sub?.banned_keywords
                    : []
                }
                showLeave={false}
                showDelete={false}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AllSubgreddiits;

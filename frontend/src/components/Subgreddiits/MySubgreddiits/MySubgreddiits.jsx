import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import { AiOutlinePlus } from "react-icons/ai";
import jwt_decode from "jwt-decode";
import Fuse from "fuse.js";

import Loading from "../../Loading";
import Navbar from "../../Navbar";
import NotFound from "../../NotFound";
import SubgreddiitCard from "../SubgreddiitCard";
import CreateSubgreddiit from "./CreateSubgreddiit";
import TagSelect from "../TagSelect";

const debug = false;

const MySubgreddiits = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedSorts, setSelectedSorts] = useState([]);
  const username = jwt_decode(
    localStorage.getItem("greddiit-access-token")
  ).username;

  const getSubs = async () => {
    try {
      const response = await axiosPrivate.get("/api/gr/mysubs");
      if (debug) console.log(response.data);
      return response.data;
    } catch (err) {
      if (debug) console.log(err);
      return null;
    }
  };

  // const queryClient = useQueryClient();

  const mysubsQuery = useQuery({
    queryKey: ["mysubs", username],
    queryFn: getSubs,
  });

  if (mysubsQuery.isLoading || !mysubsQuery.data) return <Loading />;

  if (mysubsQuery.isError) return <NotFound />;

  const mysubsFuse = new Fuse(mysubsQuery.data, {
    keys: ["name"],
    useExtendedSearch: true,
  });

  const filteredSubs = query
    ? mysubsFuse.search(query).map((entry) => entry.item)
    : mysubsQuery.data;

  const allTags = filteredSubs.map((item) => item.tags).flat();
  const allTagsOptions = allTags.map((tag) => {
    return { value: tag, label: tag };
  });

  let displaySubs = filteredSubs;
  if (selectedTags.length) {
    displaySubs = filteredSubs.filter((item) =>
      selectedTags.some((tagObj) => item.tags.includes(tagObj.value))
    );
  }

  const sortOptions = [
    {
      value: "Name Ascending",
      label: "Name Ascending",
    },
    {
      value: "Name Descending",
      label: "Name Descending",
    },
    {
      value: "Followers Descending",
      label: "Followers Descending",
    },
    {
      value: "Creation Date",
      label: "Creation Date",
    },
  ];

  const selectedSortsValues = selectedSorts.map((item) => item.value);
  if (
    selectedSortsValues.includes("Name Ascending") &&
    selectedSortsValues.includes("Name Descending")
  ) {
    setSelectedSorts([]);
    window.alert(
      "That sorting criteria makes no sense. Remove one of the Name based sorts."
    );
  }

  displaySubs.sort((a, b) => {
    for (let i = 0; i < selectedSortsValues.length; i++) {
      const criteria = selectedSortsValues[i];
      let cmp;

      switch (criteria) {
        case "Name Ascending":
          cmp = a.name.localeCompare(b.name);
          break;
        case "Name Descending":
          cmp = b.name.localeCompare(a.name);
          break;
        case "Followers Descending":
          cmp = b.num_people - a.num_people;
          break;
        case "Creation Date":
          cmp = new Date(b.createdAt) - new Date(a.createdAt);
          break;
        default:
          throw new Error("Unexpected sort criteria " + criteria);
      }

      if (cmp) return cmp;
    }
    return 0;
  });

  return (
    <>
      <Navbar />

      <div className="flex flex-col w-full justify-center">
        <div className="p-4 text-center flex flex-col w-full justify-center">
          <div className="w-full my-5 flex justify-center">
            <button
              className="btn btn-wide btn-primary gap-2"
              onClick={() => setShowModal(true)}
            >
              <AiOutlinePlus />
              Create Sub
            </button>
          </div>

          <div className="flex justify-center">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search…"
                  className="input input-bordered"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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

          <div className="flex flex-row justify-around w-full">
            <div className="w-1/2 mt-5">
              <div className="w-2/3">
                <TagSelect
                  handleChange={(selected) => setSelectedTags(selected)}
                  options={allTagsOptions}
                />
              </div>
            </div>

            <div className="w-1/2 mt-5 flex justify-center">
              <div className="w-1/2">
                <TagSelect
                  handleChange={(selected) => setSelectedSorts(selected)}
                  options={sortOptions}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="p-4 flex flex-row flex-wrap w-full justify-around">
          {/* {mysubsQuery.data.map((sub, idx) => ( */}
          {displaySubs.map((sub, idx) => (
            <div
              key={`${Math.floor(Math.random() * 100)}-sub-${sub?.name}`}
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
                image={sub?.image}
                actionLoading={deleteLoading}
                setActionLoading={setDeleteLoading}
                showLeave={false}
                showDelete={true}
                showDisabledLeave={false}
              />
            </div>
          ))}
        </div>
      </div>
      {showModal ? <CreateSubgreddiit setShowModal={setShowModal} /> : ""}
    </>
  );
};

export default MySubgreddiits;

import React from "react";
import { BsArrowRight, BsCardText, BsTrash } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const SubgreddiitCard = ({
  name,
  description,
  numPeople,
  numPosts,
  bannedKeywords,
  tags,
  handleSubDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full border-2 border-l-indigo-50">
      <div className="card m-5 bg-base-100 shadow-xl">
        <figure
          className="hover:cursor-pointer"
          onClick={() => navigate("/r/" + name)}
        >
          <img src="https://source.unsplash.com/random" alt="Shoes" />
        </figure>
        <div className="card-body">
          <h2 className="text-center font-bold text-2xl text-primary">
            r/{name}
          </h2>

          <p className="text-center">{description}</p>

          <div className="flex flex-row justify-around">
            <div>
              <FiUsers style={{ display: "inline" }} /> : {numPeople}
            </div>

            <div>
              <BsCardText style={{ display: "inline" }} /> : {numPosts}
            </div>
          </div>

          <div className="text-center">
            Banned Keywords:{" "}
            {bannedKeywords && bannedKeywords.length
              ? bannedKeywords.join(", ")
              : ""}
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
            <div>
              <button
                className="btn btn-square btn-outline mt-3"
                onClick={handleSubDelete}
              >
                <BsTrash />
              </button>
            </div>

            <div>
              <button
                className="btn btn-square btn-outline mt-3"
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

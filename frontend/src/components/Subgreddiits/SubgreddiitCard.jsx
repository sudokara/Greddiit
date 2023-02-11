import React from "react";
import { BsArrowRight, BsCardText, BsTrash } from "react-icons/bs";
import { FiUsers } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
    <div className="flex w-full">
      <div className="card card-compact w-96 m-5 bg-base-100 shadow-xl">
        <figure
          className="hover:cursor-pointer"
          onClick={() => navigate("/r/" + name)}
        >
          <img src="https://source.unsplash.com/random" alt="Shoes" />
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

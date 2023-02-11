import React from "react";
import Navbar from "../../Navbar";
import SubgreddiitCard from "../SubgreddiitCard";
import { useNavigate } from "react-router-dom";

const MySubgreddiits = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="flex flex-col w-full justify-center">
        <div className="p-4 text-center flex flex-col w-full justify-center">

          <div className="w-2/3 m-5">
            <button className="btn btn-wide btn-primary">Create</button>
          </div>

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

        <div className="divider"></div>

        <div className="p-4 flex flex-row flex-wrap w-full border-2 border-sky-300">
          
          <div className="border-2 md:w-1/2 lg:w-1/3 xl:w-1/4 border-sky-300">
            <SubgreddiitCard
              name="bangalore"
              description="Namma ooru bengaluru namma ooru; e sala cup namde will never work; im intentionally biggifying this description to see how it looks; the quick brown fox jumps over the lazy dog"
              tags={["bangalore", "bengaluru", "silicon city", "another tag", "yet another tag"]}
              numPeople={23423}
              numPosts={37924}
              bannedKeywords={["hindi", "hyderabad"]}
            />
          </div>

          <div className="border-2 md:w-1/2 lg:w-1/3 xl:w-1/4 border-red-300">
            <SubgreddiitCard
              name="bangalore"
              description="Namma ooru"
              tags={["bangalore", "bengaluru"]}
            />
          </div>

          <div className="border-2 md:w-1/2 lg:w-1/3 xl:w-1/4 border-red-300">
            <SubgreddiitCard
              name="bangalore"
              description="Namma ooru"
              tags={["bangalore", "bengaluru"]}
            />
          </div>

          <div className="border-2 md:w-1/2 lg:w-1/3 xl:w-1/4 border-red-300">
            <SubgreddiitCard
              name="bangalore"
              description="Namma ooru"
              tags={["bangalore", "bengaluru"]}
            />
          </div>

          <div className="border-2 md:w-1/2 lg:w-1/3 xl:w-1/4 border-red-300">
            <SubgreddiitCard
              name="mac"
              description="Namma ooru"
              tags={["bangalore", "bengaluru"]}
            />
          </div>

          <div className="border-2 md:w-1/2 lg:w-1/3 xl:w-1/4 border-red-300">
            <SubgreddiitCard
              name="bangalore"
              description="Namma ooru"
              tags={["bangalore", "bengaluru"]}
            />
          </div>

        </div>
      </div>
    </>
  );
};

export default MySubgreddiits;

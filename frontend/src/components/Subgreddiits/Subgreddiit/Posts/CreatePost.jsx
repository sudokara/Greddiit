import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { axiosPrivate } from "../../../../api/axios";
import Loading from "../../../Loading";

const debug = false;

const CreatePost = ({ setShowModal, subName }) => {
  const titleRef = useRef();
  const textRef = useRef();

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");

  const queryClient = useQueryClient();

  const checkFormValid = () => {
    setIsValid(titleRef.current.value && textRef.current.value);
  };

  const handleCreatePost = async () => {
    setIsLoading(true);
    checkFormValid();
    if (isValid) {
      try {
        const response = axiosPrivate.post(`/api/post/${subName}`, {
          title: titleRef.current.value,
          text: textRef.current.value,
        });
        if (debug) console.log(response.data);
        setSubmitSuccess("success");
      } catch (err) {
        if (debug) console.error(err);
        setSubmitSuccess("error");
        setTimeout(() => {
          setSubmitSuccess("error");
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSubmitSuccess("error");
      setIsLoading(false);
    }
  };

  const createPostMutation = useMutation({
    mutationFn: handleCreatePost,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["posts", subName]);
        queryClient.invalidateQueries(["subinfo", subName]);
      }, 1000);
    },
  });

  if (createPostMutation.isLoading) return <Loading />;

  if (createPostMutation.isError) setSubmitSuccess("error");

  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="text-lg font-bold text-primary">Create Post</h3>

          <form
            id="create-post-form"
            onSubmit={(e) => {
              e.preventDefault();
              createPostMutation.mutate();
            }}
          >
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text">Title</span>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="I <3 greddiit"
                  className="input input-bordered active:border-primary hover:border-primary focus:border-primary m-1"
                  ref={titleRef}
                  autoFocus
                  onChange={checkFormValid}
                />
              </label>
            </div>

            <div className="form-control">
              <label htmlFor="text" className="label">
                <span className="label-text">Text</span>
                <textarea
                  className="textarea textarea-bordered w-[14.5rem] hover:border-primary focus:border-primary active:border-primary m-1"
                  id="text"
                  placeholder="A subgreddiit for the famed dracula colorscheme."
                  ref={textRef}
                  onChange={checkFormValid}
                ></textarea>
              </label>
            </div>

            <div className="form-control">
              <button
                type="submit"
                className={`btn btn-secondary ${isLoading ? "loading" : ""}`}
                disabled={!isValid}
              >
                Create
              </button>
            </div>
          </form>

          {submitSuccess === "success" ? (
            <div className="alert alert-success shadow-lg my-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Post created!</span>
              </div>
            </div>
          ) : submitSuccess === "error" ? (
            <div className="alert alert-error shadow-lg my-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Error! Could not create post.</span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default CreatePost;

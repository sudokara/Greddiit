import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { axiosPrivate } from "../../../api/axios";
import jwt_decode from "jwt-decode";

import Loading from "../../Loading";

const CreateSubgreddiit = ({ setShowModal }) => {
  const queryClient = useQueryClient();

  const nameRef = useRef();
  const descRef = useRef();
  const tagsRef = useRef();
  const bannedRef = useRef();

  const [isValid, setIsValid] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [image, setImage] = useState("");
  const [fileSizeExceeded, setFileSizeExceeded] = useState(false);
  const username = jwt_decode(
    localStorage.getItem("greddiit-access-token")
  ).username;

  const tagPattern = /^$|^[a-z0-9]+(,[a-z0-9]+)*$/;
  const bannedPattern = /^$|^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$/;

  const maxImageSizeMb = 1;

  const handleCheckValid = () => {
    setIsValid(
      nameRef.current.value &&
        descRef.current.value &&
        tagPattern.test(tagsRef.current.value) &&
        bannedPattern.test(bannedRef.current.value) &&
        !fileSizeExceeded
    );
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fileMb = file.size / 1024 ** 2;

    if (fileMb > maxImageSizeMb) {
      alert("The image you uploaded is too big.");
      setFileSizeExceeded(true);
      setIsValid(false);
    } else {
      const base64 = await convertToBase64(file);
      setFileSizeExceeded(false);
      setImage(base64);
      handleCheckValid();
    }
  };

  const handleCreateSubgreddiit = () => {
    setisLoading(true);
    handleCheckValid();
    if (isValid) {
      axiosPrivate
        .post("/api/gr/create", {
          name: nameRef.current.value,
          description: descRef.current.value,
          tags: tagsRef.current.value.split(","),
          banned_keywords: bannedRef.current.value.split(","),
          image: image,
        })
        .then((response) => {
          console.log(response);
          setSubmitSuccess("success");
        })
        .catch((err) => {
          console.error(err);
          setSubmitSuccess("error");
          setTimeout(() => {
            setSubmitSuccess("error");
          }, 3000);
        })
        .then(() => setisLoading(false));
    } else {
      setSubmitSuccess("error");
      setisLoading(false);
    }
  };

  const createSubMutation = useMutation({
    mutationFn: handleCreateSubgreddiit,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["mysubs", username]);
      }, 1000);
    },
  });

  if (createSubMutation.isLoading) return <Loading />;

  if (createSubMutation.isError) setSubmitSuccess("error");

  return (
    <>
      <div className={`modal modal-open`}>
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            x
          </button>
          <h3 className="text-xl text-primary font-bold">Create Subgreddiit</h3>

          <form
            id="create-sub-form"
            onSubmit={(e) => {
              e.preventDefault();
              createSubMutation.mutate();
            }}
          >
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text">Name: r/</span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="dracula"
                  className="input input-bordered active:border-primary hover:border-primary focus:border-primary m-1"
                  ref={nameRef}
                  autoFocus
                  onChange={handleCheckValid}
                />
              </label>
            </div>

            <div className="form-control">
              <label htmlFor="description" className="label">
                <span className="label-text">Description</span>
                <textarea
                  className="textarea textarea-bordered w-[14.5rem] hover:border-primary focus:border-primary active:border-primary m-1"
                  id="description"
                  placeholder="A subgreddiit for the famed dracula colorscheme."
                  ref={descRef}
                  onChange={handleCheckValid}
                ></textarea>
              </label>
            </div>

            <div className="form-control">
              <label htmlFor="tags" className="label">
                <span className="label-text">
                  Tags (comma separated,single word, lower case, no spaces)
                </span>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  placeholder="dracula,theme"
                  className="input input-bordered active:border-primary focus:border-primary hover:border-primary m-1"
                  ref={tagsRef}
                  onChange={handleCheckValid}
                />
              </label>
            </div>

            <div className="form-control">
              <label htmlFor="bannedKeywords" className="label">
                <span className="label-text">
                  Banned Keywords (comma separated,single word,no spaces)
                </span>
                <input
                  type="text"
                  name="bannedKeywords"
                  id="bannedKeywords"
                  placeholder="solarized,light"
                  className={`input input-bordered active:border-primary focus:border-primary hover:border-primary m-1`}
                  ref={bannedRef}
                  onChange={handleCheckValid}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Sub image(max size {maxImageSizeMb}mb)
                </span>
              </label>
              <input
                type="file"
                className="w-full mb-4 file-input file-input-bordered"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
              />
            </div>

            <div className="form-control">
              <button
                className={`btn btn-secondary ${isLoading ? "loading" : ""}`}
                disabled={!isValid}
                type="submit"
              >
                Create
              </button>
            </div>

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
                  <span>Subgreddiit created!</span>
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
                  <span>
                    Error! Could not make subgreddiit. Name taken or server
                    error
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSubgreddiit;

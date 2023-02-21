import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { axiosPrivate } from "../../../../api/axios";

const CommentsCard = ({ showModal, setShowModal, comments, subgr, id }) => {
  const commentRef = useRef();
  const [loading, setLoading] = useState(false);

  const debug = false;

  const handleMakeComment = async () => {
    setLoading(true);

    try {
      const response = await axiosPrivate.post(
        `/api/post/comment/${subgr}/${id}`,
        {
          text: commentRef.current.value,
        }
      );
      if (debug) console.log(response.daata);
    } catch (err) {
      if (debug) console.error(err);
    } finally {
      setLoading(false);
      commentRef.current.value = "";
    }
  };

  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: handleMakeComment,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(["posts", subgr]);
      }, 1000);
    },
  });

  return (
    <>
      <div className={`modal ${showModal ? "modal-open" : ""}`}>
        <div className="modal-box relative">
          <button
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
          <h3 className="text-lg w-full font-bold text-primary">Comments</h3>
          <div className="py-4">
            <form
              className="mb-2 w-full flex justify-center"
              onSubmit={(e) => {
                e.preventDefault();
                commentMutation.mutate();
              }}
            >
              <div className="form-control">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Your Comment"
                    className="input input-bordered"
                    ref={commentRef}
                  />
                  <button
                    type="submit"
                    className={`btn btn-square ${loading ? "loading" : ""}`}
                  >
                    <AiOutlineSend />
                  </button>
                </div>
              </div>
            </form>

            <ul>
              {comments.map((comment) => (
                <div key={comment.id}>
                  <li>
                    <div className="w-full card mt-2 bg-base-100 shadow-xl flex flex-col flex-wrap justify-center">
                      <div className="flex justify-start text-sm">
                        u/{comment.username}
                      </div>
                      <div className="flex">{comment.comment_text}</div>
                    </div>
                  </li>
                  <div className="divider"></div>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsCard;

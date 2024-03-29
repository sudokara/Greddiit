import React from "react";

const Modal = ({ id, heading, array, handleClick }) => {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor={id}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">{heading}</h3>
          <ul className="list-none">
            {array.length
              ? array.map((item) => (
                  <li className=" m-5" key={`${array.indexOf(item)} ${id}`}>
                    <button className="btn btn-circle" onClick={() => handleClick(item)}>
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    {item}
                  </li>
                ))
              : "Nothing to see here"}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Modal;

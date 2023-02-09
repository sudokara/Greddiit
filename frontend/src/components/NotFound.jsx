import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#282a36]">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
      <div className="bg-[#ff79c6] px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
        <div className="relative inline-block text-sm font-medium text-[#ff79c6] group active:text-orange-500 focus:outline-none focus:ring">
          <button className="btn btn-primary mt-5">
            <Link to="/" replace>Home</Link>
          </button>
        </div>
    </div>
  );
};

export default NotFound;
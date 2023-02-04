import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div class="h-screen w-full flex flex-col justify-center items-center bg-[#282a36]">
      <h1 class="text-9xl font-extrabold text-white tracking-widest">404</h1>
      <div class="bg-[#ff79c6] px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
        <a class="relative inline-block text-sm font-medium text-[#ff79c6] group active:text-orange-500 focus:outline-none focus:ring">
          <button class="btn btn-primary mt-5">
            <Link to="/" replace>Home</Link>
          </button>
        </a>
    </div>
  );
};

export default NotFound;
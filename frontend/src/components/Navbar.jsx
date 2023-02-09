import React from "react";
import { VscSignOut } from "react-icons/vsc";
import { BsPerson, BsBookmarks, BsBinoculars } from "react-icons/bs";
import { FiAnchor } from "react-icons/fi";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const pageTitles = {
    "/me": "My Profile",
    "/myr": "My Subgreddiits",
    "/saved": "Saved Posts",
    "/r": "Subgreddiits"
  };

  return (
    <>
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-2xl mt-3">
        <div className="avatar mx-3">
          <NavLink className="w-8 rounded" to="/">
            <img src={require("../assets/ghosts.png")} alt="Greddiit Ghosts" />
          </NavLink>
        </div>
        <div className="flex-1">
          <NavLink
            className="btn btn-ghost normal-case text-xl hover:bg-primary"
            to="/"
          >
            Greddiit
          </NavLink>
        </div>

        <div className="flex-1 text-xl text-primary font-bold">
          {pageTitles[location.pathname]}
        </div>
        
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {/* <li>
              <a>Item 1</a>
            </li>
            <li>
                <a>Item 2</a>
            </li> */}

            <li className="mx-1.5">
              <NavLink
                to="/r"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <BsBinoculars />
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/myr"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <FiAnchor />
              </NavLink>
            </li>
            
            <li className="mx-1.5">
              <NavLink
                to="/saved"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <BsBookmarks />
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/me"
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <BsPerson />
              </NavLink>
            </li>

            <li className="mx-1.5">
              <NavLink
                to="/auth"
                onClick={() => localStorage.clear()}
                className={({ isActive }) =>
                  isActive ? "bg-primary" : "hover:bg-secondary"
                }
              >
                <VscSignOut />
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {/* End Navbar  */}
    </>
  );
};

export default Navbar;

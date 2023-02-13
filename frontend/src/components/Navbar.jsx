import React, { useEffect, useCallback } from "react";
import { VscSignOut } from "react-icons/vsc";
import { BsPerson, BsBookmarks, BsBinoculars } from "react-icons/bs";
import { FiAnchor } from "react-icons/fi";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitles = {
    "/me": "My Profile",
    "/myr": "My Subgreddiits",
    "/saved": "Saved Posts",
    "/r": "Subgreddiits",
  };

  const subNameRegex = /\/r\/([^\/]+)/; // get everything between /r and the next /
  let currentPage = pageTitles[location.pathname] || "";
  const subName = subNameRegex.exec(location.pathname) || "";
  if (subName) {
    currentPage = subName[0].slice(1).replace("%20", " ");
  }

  // console.log(
  //   subNameRegex.exec(location.pathname)
  //     ? subNameRegex.exec(location.pathname)[1]
  //     : ""
  // );

  const handleKeyPress = useCallback((event) => {
    if (
      event.target.nodeName !== "INPUT" &&
      event.target.nodeName !== "TEXTAREA"
    ) {
      // console.log(`Key pressed: ${event.key}`);
      switch (event.key) {
        case "p":
          navigate("/me");
          break;
        case "s":
          navigate("/saved");
          break;
        case "m":
          navigate("/myr");
          break;
        case "a":
          navigate("/r");
          break;
        default:
          break;
      }
    }
  }, [navigate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      {/* Navbar */}
      <div className="navbar flex-wrap bg-base-100 shadow-2xl mt-3 sticky top-0 z-50">
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
          {currentPage}
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

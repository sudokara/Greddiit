import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireUnauth from "./components/RequireUnauth";
import Authorize from "./components/AuthPage/Authorize";
import Profile from "./components/ProfilePage/Profile";
import NotFound from "./components/NotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* <HashRouter> */}
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth redirectTo={"/auth"}>
              <Navigate to="/me" />
            </RequireAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <RequireUnauth redirectTo={"/me"}>
              <Authorize />
            </RequireUnauth>
          }
        />
        <Route
          path="/me"
          element={
            <RequireAuth redirectTo="/auth">
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </BrowserRouter>
    {/* </HashRouter> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

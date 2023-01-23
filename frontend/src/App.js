import "./App.css";
import {BrowserRouter, Route, Routes } from "react-router-dom";

import NotFound from "./components/NotFound";
import Login from "./components/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        {/* <Route path="/me" element={<Profile />}></Route> */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

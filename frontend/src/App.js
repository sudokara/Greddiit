import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authorize from "./components/Authorize";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import RequireAuth from "./components/RequireAuth";
import RequireUnauth from "./components/RequireUnauth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
  );
}

export default App;

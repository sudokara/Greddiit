import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireUnauth from "./components/RequireUnauth";
import Authorize from "./components/AuthPage/Authorize";
import Profile from "./components/ProfilePage/Profile";
import NotFound from "./components/NotFound";

function App() {
  return (
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
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireUnauth from "./components/RequireUnauth";
import Authorize from "./components/AuthPage/Authorize";
import Profile from "./components/ProfilePage/Profile";
import NotFound from "./components/NotFound";
import MySubgreddiits from "./components/MySubgreddiits/MySubgreddiits";
import SavedPosts from "./components/SavedPosts/SavedPosts";
import Subgreddiits from "./components/Subgreddiits/Subgreddiits";

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
      <Route
        path="/myr"
        element={
          <RequireAuth redirectTo="/auth">
            <MySubgreddiits />
          </RequireAuth>
        }
      />
      <Route
        path="/r"
        element={
          <RequireAuth redirectTo="/auth">
            <Subgreddiits />
          </RequireAuth>
        }
      />
      <Route
        path="/saved"
        element={
          <RequireAuth redirectTo="/auth">
            <SavedPosts />
          </RequireAuth>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

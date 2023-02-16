import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import RequireUnauth from "./components/RequireUnauth";
import Authorize from "./components/AuthPage/Authorize";
import Profile from "./components/ProfilePage/Profile";
import NotFound from "./components/NotFound";
import MySubgreddiits from "./components/Subgreddiits/MySubgreddiits/MySubgreddiits";
import SavedPosts from "./components/SavedPosts/SavedPosts";
import AllSubgreddiits from "./components/Subgreddiits/AllSubgreddiits/AllSubgreddiits";
import Subgreddiit from "./components/Subgreddiits/Subgreddiit/Subgreddiit";
import ModActions from "./components/Subgreddiits/Subgreddiit/ModActions";

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
            <AllSubgreddiits />
          </RequireAuth>
        }
      />
      <Route
        path="/r/:name/users"
        element={
          <RequireAuth redirectTo="/auth">
            <ModActions mode="users" />
          </RequireAuth>
        }
      />
      <Route
        path="/r/:name/jreqs"
        element={
          <RequireAuth redirectTo="/auth">
            <ModActions mode="jreqs" />
          </RequireAuth>
        }
      />
      <Route
        path="/r/:name/stats"
        element={
          <RequireAuth redirectTo="/auth">
            <ModActions mode="stats" />
          </RequireAuth>
        }
      />
      <Route
        path="/r/:name/reports"
        element={
          <RequireAuth redirectTo="/auth">
            <ModActions mode="reports" />
          </RequireAuth>
        }
      />
      <Route
        path="/r/:name"
        element={
          <RequireAuth redirectTo="/auth">
            <Subgreddiit />
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

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authorize from "./components/Authorize";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Authorize />} />
        <Route path="/me" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

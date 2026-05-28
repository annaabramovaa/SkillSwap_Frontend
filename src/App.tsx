import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { SignUp } from "./pages/SignUp/SignUp";
import { SignIn } from "./pages/SighnIn/SignIn";
import { Profile } from "./pages/Profile/Profile";
import { Matches } from "./pages/Matches/Matches";
import { UserHomePage } from "./pages/UserHomePage/UserHomePage";
import { AdminRoute } from "./components/AdminRoute/AdminRoute";
import { AdminPage } from "./pages/AdminPage/AdminPage";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/userhome" element={<UserHomePage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

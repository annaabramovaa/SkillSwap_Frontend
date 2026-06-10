import { Route, Routes } from "react-router-dom";
import { HomePage } from "src/pages/HomePage/HomePage";
import { SignUp } from "src/pages/SignUp/SignUp";
import { SignIn } from "src/pages/SignIn/SignIn";
import { Profile } from "src/pages/Profile/Profile";
import { Matches } from "src/pages/Matches/Matches";
import { UserHomePage } from "src/pages/UserHomePage/UserHomePage";
import { AdminRoute } from "src/components/AdminRoute/AdminRoute";
import { AdminPage } from "src/pages/AdminPage/AdminPage";

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

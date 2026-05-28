import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  let payload;

  try {
    payload = JSON.parse(atob(token.split(".")[1]));
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }

  if (payload.role !== "admin") {
    return <Navigate to="/userhome" />;
  }

  return children;
};

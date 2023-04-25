import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return !isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

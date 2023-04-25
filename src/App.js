import React, { useEffect } from "react";
import Map from "./pages/Map/Map";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import MainNavigation from "./components/MainNav/MainNavigation";
import ProtectedRoute from "./pages/ProtectedRoutes/ProtectedRoute";
import ChangePassword from "./pages/Password/ChangePassword";
import { Navigate, } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userStatus } from "./redux-store/userSlice";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.user);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(userStatus());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <BrowserRouter>
      <div className="wrapper">
        <MainNavigation user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route
            path="/change-password"
            element={isLoggedIn ? <ChangePassword /> : <Navigate to="/" />}
          />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

// src/router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "../auth/auth";
import Landing from "../components/Landing";
import Signin from "../components/Signin";
import Dashboard from "../components/Dashboard";
import ProtectedLayout from "../components/ProtectedLayout";
import type { JSX } from "react";
import Joinspace from "../components/Joinspace";
import Profile from "../components/Profile";
import ExploreSpace from "../components/ExploreSpace";
import MapExplore from "../components/MapExplore";
import Multispace from "../components/Multispace";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = auth.getToken();
  return token ? children : <Navigate to="/signin" />;
};

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />

        {/* Protected Routes under layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProtectedLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="joinspace" element={<Joinspace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="explorespace" element={<ExploreSpace />} />
          <Route path="mapExplore/:mapId" element={<MapExplore />} />
          <Route path ="multi-space/:spaceId" element={<Multispace />} />
          {/* Add more protected routes here */}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

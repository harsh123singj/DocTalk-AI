import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import GoogleSuccess from "../components/auth/GoogleSuccess";

import Dashboard from "../pages/dashboard/Dashboard";
import Documents from "../pages/documents/Document";
import Workspaces from "../pages/workspaces/Workspace";
import AIAssistant from "../pages/assistant/AIAssistant";
import Settings from "../pages/settings/Settings";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/auth/google/success"
        element={<GoogleSuccess />}
      />


      {/* ================= PROTECTED APP ================= */}

      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* Workspaces */}
          <Route
            path="/workspaces"
            element={<Workspaces />}
          />


          {/* Documents inside a workspace */}
          <Route
            path="/workspaces/:workspaceId/documents"
            element={<Documents />}
          />


          {/* Alternative documents URL */}
          <Route
            path="/documents/:workspaceId"
            element={<Documents />}
          />


          {/* AI Assistant */}
          <Route
            path="/AIassistant"
            element={<AIAssistant />}
          />


          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Route>


      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />


      {/* ================= UNKNOWN ROUTE ================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;
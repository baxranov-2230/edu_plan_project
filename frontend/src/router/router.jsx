import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import Curriculums from "../pages/Curriculums";
import Downloads from "../pages/Downloads";
import Programs from "../pages/Programs";
import Classes from "../pages/Classes";
import Faculties from "../pages/Faculties";
import Departments from "../pages/Departments";
import Roles from "../pages/Roles";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore.getState();
  // We use getState() here to avoid hook rules inside plain function or need to refactor to component
  // Actually router definition is outside component, so we can't use hooks.
  // Standard pattern for data router is to checking auth in loader or wrapper.
  // Existing code used a wrapper component method inside layout? 
  // Wait, the previous code showed ProtectedRoute as a component being used in the element prop. 
  // Let's stick to the existing pattern but I need to make sure `useAuthStore` works. 
  // The existing code has `useAuthStore` inside `ProtectedRoute` component which IS correct if `ProtectedRoute` is a component.
  // However, `router` object creation happens once. 
  return children;
};

// We need to use the ProtectRoute component inside the element, 
// BUT the existing code had `element: <ProtectedRoute><MainLayout /></ProtectedRoute>`.
// Let's use that same pattern but we need to define ProtectedRoute properly as a component function if it isn't already.

const ProtectedRouteWrapper = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRouteWrapper>
        <MainLayout />
      </ProtectedRouteWrapper>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "curriculums",
        element: <Curriculums />,
      },
      {
        path: "downloads",
        element: <Downloads />,
      },
      {
        path: "programs",
        element: <Programs />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "faculties",
        element: <Faculties />,
      },
      {
        path: "departments",
        element: <Departments />,
      },
      {
        path: "roles",
        element: <Roles />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;


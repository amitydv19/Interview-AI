import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/home";
import Landing from "./features/interview/pages/landing";
import Interview from "./features/interview/pages/interview";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />, // 👈 NOW landing page shows first
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/home",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>
  },
]);

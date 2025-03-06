import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout
import MainLayout from "./pages/main/MainLayout";

// Pages
import NotFound from "./pages/NotFound";
import Home from "./pages/main/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Notification from "./pages/main/Notifications";
import ProfilePage from "./pages/main/Profile";

const router = createBrowserRouter(
  [
    {
      path: "/signin",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/notifications",
          element: <Notification />,
        },
        {
          path: "/profile/:username",
          element: <ProfilePage />,
        },
      ]
    },
    { path: "*", element: <NotFound /> }, // catch all route
  ]
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

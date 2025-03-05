import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import NotFound from "./pages/NotFound";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth/login",
      element: <Login />,
    },
    {
      path: "/auth/signup",
      element: <SignUp />,
    },
    { path: "*", element: <NotFound /> },
  ]
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

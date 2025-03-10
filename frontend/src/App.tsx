import { useState } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./pages/main/MainLayout";
import RootLayout from "./pages/RootLayout";

// Pages
import HomePage from "./pages/main/Home";
import ProfilePage from "./pages/main/Profile";
import Notification from "./pages/main/Notifications";
import LoginPage from "./pages/auth/Login";
import SignUpPage from "./pages/auth/SignUp";
import NotFound from "./pages/NotFound";

//context
import { UserContext } from "./context/User.Context";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null)

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/notifications" element={<Notification />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  )

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
      <Toaster />
    </UserContext.Provider>
  )
}

export default App;

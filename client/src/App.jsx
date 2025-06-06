import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";

import { Routes, Route, Navigate} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader }  from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore();

  console.log("Online Users:", onlineUsers); // Log online users

  // IMPORTANT: Theme useEffect must come BEFORE any early returns
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser, theme}); // Add theme to console log

  // Early return for loading state
  if(isCheckingAuth && !authUser) return (
     <div className="flex items-center justify-center h-screen" data-theme={theme}>
      <Loader className="size-10 animate-spin"/>
     </div>
  )

  return (
    <div data-theme={theme}>
      <NavBar/>
      <Routes>
        <Route path="/" element={authUser? <Home /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/users" element={authUser? <Friends /> : <Navigate to="/" />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser? <Profile /> : <Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
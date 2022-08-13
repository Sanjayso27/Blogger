import React, { useCallback, useState } from "react";
import { AuthContext } from "./context/auth-context";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Blogs from "./pages/Blogs";
import Users from "./pages/Users";
import UserBlogs from "./pages/UserBlogs";
import NewBlog from "./pages/NewBlog";
import UpdateBlog from "./pages/UpdateBlog";
import Auth from "./pages/Auth";
import MainNavigation from "./components/Navigation/MainNavigation";
import BlogOne from "./pages/BlogOne";
import Home from "./pages/Home";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);
  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);
  const routes = isLoggedIn ? (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/ind/:blogId" element={<BlogOne />} />
      <Route path="/users" element={<Users />} />
      <Route path="/:userId/blogs" element={<UserBlogs />} />
      <Route path="/blogs/new" element={<NewBlog />} />
      <Route path="/blogs/update/:blogId" element={<UpdateBlog />} />
      <Route path="*" element={<Home />} />
    </>
  ) : (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/ind/:blogId" element={<BlogOne />} />
      <Route path="/users" element={<Users />} />
      <Route path="/:userId/blogs" element={<UserBlogs />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Home />} />
    </>
  );
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <Routes>{routes}</Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

import React, { useState } from "react";
import "./App.css"; // Optional: Add any additional global styles
import Home from "./components/home";
import SwipeableProfileCards from "./components/profiles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserProfile from "./components/userProfile";
import { auth } from "./firebase";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profiles" element={<SwipeableProfileCards />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;

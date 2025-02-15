import React, { useState } from "react";
import ProfileCard from "./components/profile";
import "./App.css"; // Optional: Add any additional global styles
import Home from "./components/home";
import SwipeableProfileCards from "./components/profiles";
import Login from "./components/login";
const App = () => {
  const [swipe, setSwipe] = useState(false);

  return (
    <div className="app">
      {swipe ? (
        <div className="profile-container">
          <SwipeableProfileCards />
        </div>
      ) : (
        <Home setSwipe={setSwipe} />
      )}
    </div>
  );
};

export default App;
